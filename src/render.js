import { VNodeFlags, ChildrenFlags } from './flags'
import { createTextVNode } from './h'
import { patchData } from './patchData'

export default function render(vnode, container) {
  const prevVNode = container.vnode
  if (prevVNode == null) {
    if (vnode) {
      // 没有旧的 VNode，使用 `mount` 函数挂载全新的 VNode
      mount(vnode, container)
      // 将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode 就存在了
      container.vnode = vnode
    }
  } else {
    if (vnode) {
      // 有旧的 VNode，则调用 `patch` 函数打补丁
      patch(prevVNode, vnode, container)
      // 更新 container.vnode
      container.vnode = vnode
    } else {
      // 有旧的 VNode 但是没有新的 VNode，这说明应该移除 DOM，在浏览器中可以使用 removeChild 函数。
      container.removeChild(prevVNode.el)
      container.vnode = null
    }
  }
}

function mount(vnode, container, isSVG, redNode) {
  const { flags } = vnode
  if (flags & VNodeFlags.ELEMENT) {
    // 挂载普通标签
    mountElement(vnode, container, isSVG, redNode)
  } else if (flags & VNodeFlags.COMPONENT) {
    // 挂载组件
    mountComponent(vnode, container, isSVG)
  } else if (flags & VNodeFlags.TEXT) {
    // 挂载纯文本
    mountText(vnode, container)
  } else if (flags & VNodeFlags.FRAGMENT) {
    // 挂载 Fragment
    mountFragment(vnode, container, isSVG)
  } else if (flags & VNodeFlags.PORTAL) {
    // 挂载 Portal
    mountPortal(vnode, container, isSVG)
  }
}

const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/
function mountElement(vnode, container, isSVG, refNode) {
  isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG
  const el = isSVG
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
    : document.createElement(vnode.tag)
  vnode.el = el
  const data = vnode.data
  if (data) {
    for (let key in data) {
      switch (key) {
        case 'style':
          for (let k in data.style) {
            el.style[k] = data.style[k]
          }
          break
        case 'class':
          if (isSVG) {
            el.setAttribute('class', data[key])
          } else {
            el.className = Array.isArray(data[key]) ? data[key].join(' ') : data[key]
          }
          break
        default:
          if (key[0] === 'o' && key[1] === 'n') {
            // 事件
            el.addEventListener(key.slice(2), data[key])
          } else if (domPropsRE.test(key)) {
            // 当作 DOM Prop 处理
            el[key] = data[key]
          } else {
            // 当作 Attr 处理
            el.setAttribute(key, data[key])
          }
          break
      }
    }
  }

  const childFlags = vnode.childFlags
  const children = vnode.children
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      mount(children, el, isSVG)
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      for (let i = 0; i < children.length; i++) {
        mount(children[i], el, isSVG)
      }
    }
  }

  refNode ? container.insertBefore(el, refNode) : container.appendChild(el)
}

function mountText(vnode, container) {
  const el = document.createTextNode(vnode.children)
  vnode.el = el
  container.appendChild(el)
}

function mountFragment(vnode, container, isSVG) {
  const { children, childFlags } = vnode
  switch (childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      mount(children, container, isSVG)
      // 单个子节点，就指向该节点
      vnode.el = children.el
      break
    case ChildrenFlags.NO_CHILDREN:
      const placeholder = createTextVNode('')
      mountText(placeholder, container)
      // 没有子节点指向占位的空文本节点
      vnode.el = placeholder.el
      break
    default:
      for (let i = 0; i < children.length; i++) {
        mount(children[i], container, isSVG)
      }
      // 多个子节点，指向第一个子节点
      vnode.el = children[0].el
  }
}

function mountPortal(vnode, container) {
  const { tag, children, childFlags } = vnode

  // 获取挂载点
  const target = typeof tag === 'string' ? document.querySelector(tag) : tag

  // 这边需要做一下判断，如果没有该dom需要自动创建一个
  if (childFlags & ChildrenFlags.SINGLE_VNODE) {
    // 将 children 挂载到 target 上，而非 container
    mount(children, target)
  } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
    for (let i = 0; i < children.length; i++) {
      // 将 children 挂载到 target 上，而非 container
      mount(children[i], target)
    }
  }

   // 占位的空文本节点
   const placeholder = createTextVNode('')
   // 将该节点挂载到 container 中
   mountText(placeholder, container, null)
   // el 属性引用该节点
   vnode.el = placeholder.el
}

function mountComponent(vnode, container, isSVG) {
  if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
    mountStatefulComponent(vnode, container, isSVG)
  } else {
    mountFunctionalComponent(vnode, container, isSVG)
  }
}

function mountStatefulComponent(vnode, container, isSVG) {
  // 创建组件实例
  const instance = new vnode.tag()
  // 渲染VNode
  instance.$vnode = instance.render()
  // 挂载
  mount(instance.$vnode, container, isSVG)
  // el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素
  instance.$el = vnode.el = instance.$vnode.el
}

function mountFunctionalComponent(vnode, container, isSVG) {
  // 获取 VNode
  const $vnode = vnode.tag()
  // 挂载
  mount($vnode, container, isSVG)
  // el 元素引用该组件的根元素
  vnode.el = $vnode.el
}

function patch(prevVNode, nextVNode, container) {
  const nextFlags = nextVNode.flags
  const prevFlags = prevVNode.flags

  if (prevFlags !== nextFlags) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.ELEMENT) {
    patchElement(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.COMPONENT) {
    patchComponent(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.TEXT) {
    patchText(prevVNode, nextVNode)
  } else if (nextFlags & VNodeFlags.FRAGMENT) {
    console.log(77777)
    patchFragment(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.PORTAL) {
    patchPortal(prevVNode, nextVNode)
  }
}

function replaceVNode(prevVNode, nextVNode, container) {
  container.removeChild(prevVNode.el)
  // 如果将要被移除的 VNode 类型是组件，则需要调用该组件实例的 unmounted 钩子函数
  if (prevVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    // 类型为有状态组件的 VNode，其 children 属性被用来存储组件实例对象
    const instance = prevVNode.children
    instance.unmounted && instance.unmounted()
  }
  mount(nextVNode, container)
}

function patchElement(prevVNode, nextVNode, container) {
  // 如果新旧 VNode 描述的是不同的标签，则调用 replaceVNode 函数使用新的 VNode 替换旧的 VNode
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
    return
  }

  // 拿到 el 元素，注意这时要让 nextVNode.el 也引用该元素
  const el = (nextVNode.el = prevVNode.el)
  const prevData = prevVNode.data
  const nextData = nextVNode.data

  if (nextData) {
    for (let key in nextData) {
      const prevValue = prevData[key]
      const nextValue = nextData[key]
      patchData(el, key, prevValue, nextValue)
    }
  }
  if (prevData) {
    for (let key in prevData) {
      const prevValue = prevData[key]
      if (prevValue && !nextData.hasOwnProperty(key)) {
        patchData(el, key, prevValue, null)
      }
    }
  }

  // 调用 patchChildren 函数递归的更新子节点
  patchChildren(
    prevVNode.childFlags, // 旧的 VNode 子节点的类型
    nextVNode.childFlags, // 新的 VNode 子节点的类型
    prevVNode.children, // 旧的 VNode 子节点
    nextVNode.children, // 新的 VNode 子节点
    el // 当前标签元素，即这些子节点的父节点
  )
}

function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 旧的 children 是单个子节点，会执行该 case 语句块
    case ChildrenFlags.SINGLE_VNODE:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 一对一，更新
          // 新的 children 也是单个子节点时，会执行该 case 语句块
          patch(prevChildren, nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          // 一对0，删除
          // 新的 children 中没有子节点时，会执行该 case 语句块
          container.removeChild(prevChildren.el)
          break
        default:
          // 一对多，删除重新挂载
          // 但新的 children 中有多个子节点时，会执行该 case 语句块
          container.removeChild(prevChildren.el)
          // 遍历新的多个子节点，逐个挂载到容器中
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break
    // 旧的 children 中没有子节点时，会执行该 case 语句块
    case ChildrenFlags.NO_CHILDREN:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 是单个子节点时，会执行该 case 语句块
          // 使用 mount 函数将新的子节点挂载到容器元素
          mount(nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时，会执行该 case 语句块
          // 什么都不做
          break
        default:
          // 新的 children 中有多个子节点时，会执行该 case 语句块
          // 遍历多个新的子节点，逐个使用 mount 函数挂载到容器元素
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break
    // 旧的 children 中有多个子节点时，会执行该 case 语句块
    default:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          mount(nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          break
        default:
          let type = 3
          //用个判断切换两个方法
          if (type == 1) {
            //方法1:
            // 但新的 children 中有多个子节点时，会执行该 case 语句块
            let lastIndex = 0
            for (let i = 0; i < nextChildren.length; i++) {
              const nextVNode = nextChildren[i]
              let j = 0,
              find = false
              for (j; j < prevChildren.length; j++) {
                const prevVNode = prevChildren[j]
                if (nextVNode.key === prevVNode.key) {
                  find = true
                  patch(prevVNode, nextVNode, container)
                  if (j < lastIndex) {
                    // 需要移动
                    const refNode = nextChildren[i - 1].el.nextSibling
                    container.insertBefore(prevVNode.el, refNode)
                    break
                  } else {
                    // 更新 lastIndex
                    lastIndex = j
                  }
                }
              }
              if (!find) {
                  // 挂载新节点
                  // 找到 refNode
                  const refNode =
                  i - 1 < 0
                    ? prevChildren[0].el
                    : nextChildren[i - 1].el.nextSibling
                  mount(nextVNode, container, false, refNode)
                }
                // 移除已经不存在的节点
                // 遍历旧的节点
                for (let i = 0; i < prevChildren.length; i++) {
                  const prevVNode = prevChildren[i]
                  // 拿着旧 VNode 去新 children 中寻找相同的节点
                  const has = nextChildren.find(
                    nextVNode => nextVNode.key === prevVNode.key
                  )
                  if (!has) {
                    // 如果没有找到相同的节点，则移除
                    container.removeChild(prevVNode.el)
                  }
                }
              }
            } else if(type == 2){
              // 方法二
              // 当新的 children 中有多个子节点时，会执行该 case 语句块
              let oldStartIdx = 0
              let oldEndIdx = prevChildren.length - 1
              let newStartIdx = 0
              let newEndIdx = nextChildren.length - 1
              let oldStartVNode = prevChildren[oldStartIdx]
              let oldEndVNode = prevChildren[oldEndIdx]
              let newStartVNode = nextChildren[newStartIdx]
              let newEndVNode = nextChildren[newEndIdx]

              while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                if (oldStartVNode.key === newStartVNode.key) {
                  patch(oldStartVNode, newStartVNode, container)
                  oldStartVNode = prevChildren[++oldStartIdx]
                  newStartVNode = nextChildren[++newStartIdx]
                } else if (oldEndVNode.key === newEndVNode.key) {
                  patch(oldEndVNode, newEndVNode, container)
                  oldEndVNode = prevChildren[--oldEndIdx]
                  newEndVNode = newEndVNode[--newEndIdx]
                } else if (oldStartVNode.key === newEndVNode.key) {
                  patch(oldStartVNode, newEndVNode, container)
                  container.insertBefore(
                    oldStartVNode.el,
                    oldEndVNode.el.nextSibling
                  )
                  oldStartVNode = prevChildren[++oldStartIdx]
                  newEndVNode = nextChildren[--newEndIdx]
                } else if (oldEndVNode.key === newStartVNode.key) {
                  patch(oldEndVNode, newStartVNode, container)
                  container.insertBefore(oldEndVNode.el, oldStartVNode.el)
                  oldEndVNode = prevChildren[--oldEndIdx]
                  newStartVNode = nextChildren[++newStartIdx]
                } else {
                  // 遍历旧 children，试图寻找与 newStartVNode 拥有相同 key 值的元素
                  const idxInOld = prevChildren.findIndex(
                    node => node.key === newStartVNode.key
                  )
                  if (idxInOld >= 0) {
                    // vnodeToMove 就是在旧 children 中找到的节点，该节点所对应的真实 DOM 应该被移动到最前面
                    const vnodeToMove = prevChildren[idxInOld]
                    // 调用 patch 函数完成更新
                    patch(vnodeToMove, newStartVNode, container)
                    // 由于旧 children 中该位置的节点所对应的真实 DOM 已经被移动，所以将其设置为 undefined
                    prevChildren[idxInOld] = undefined
                    // 把 vnodeToMove.el 移动到最前面，即 oldStartVNode.el 的前面
                    container.insertBefore(vnodeToMove.el, oldStartVNode.el)
                  } else {
                    // 使用 mount 函数挂载新节点
                    mount(newStartVNode, container, false, oldStartVNode.el)
                  }
                  // 将 newStartIdx 下移一位
                  newStartVNode = nextChildren[++newStartIdx]
                }
              }
              if (oldEndIdx < oldStartIdx) {
                // 添加新节点
                for (let i = newStartIdx; i <= newEndIdx; i++) {
                  mount(nextChildren[i], container, false, oldStartVNode && oldStartVNode.el)
                }
              } else if (newEndIdx < newStartIdx) {
                // 移除操作
                for (let i = oldStartIdx; i <= oldEndIdx; i++) {
                  container.removeChild(prevChildren[i].el)
                }
              }
            } else {
              // 更新相同的前缀节点
              let j = 0
              let prevVNode = prevChildren[j]
              let nextVNode = nextChildren[j]
              let prevEnd = prevChildren.length - 1
              let nextEnd = nextChildren.length - 1

              outer: {
                while (prevVNode.key === nextVNode.key) {
                  patch(prevVNode, nextVNode, container)
                  j++
                  if (j > prevEnd || j > nextEnd) {
                    break outer
                  }
                  prevVNode = prevChildren[j]
                  nextVNode = nextChildren[j]
                }
                // 更新相同的后缀节点
                prevVNode = prevChildren[prevEnd]
                nextVNode = nextChildren[nextEnd]
                while (prevVNode.key === nextVNode.key) {
                  patch(prevVNode, nextVNode, container)
                  prevEnd--
                  nextEnd--
                  if (j > prevEnd || j > nextEnd) {
                    break outer
                  }
                  prevVNode = prevChildren[prevEnd]
                  nextVNode = nextChildren[nextEnd]
                }
              }

              if (j > prevEnd && j <= nextEnd) {
                // j -> nextEnd 之间的节点应该被添加
                const nextPos = nextEnd + 1
                const refNode =
                  nextPos < nextChildren.length ? nextChildren[nextPos].el : null
                while (j <= nextEnd) {
                  mount(nextChildren[j++], container, false, refNode)
                }
              } else if (j > nextEnd) {
                while (j <= prevEnd) {
                  container.removeChild(prevChildren[j++].el)
                }
              } else {
                // 构造 source 数组
                const nextLeft = nextEnd - j + 1 // 新 children 中剩余未处理节点的数量
                const source = []
                for (let i = 0; i < nextLeft; i++) {
                  source.push(-1)
                }

                const prevStart = j
                const nextStart = j
                let moved = false
                let pos = 0
                // for (let i = prevStart; i <= prevEnd; i++) {
                //   const prevVNode = prevChildren[i]
                //   for (let k = nextStart; k <= nextEnd; k++) {
                //     const nextVNode = nextChildren[k]
                //     if (prevVNode.key === nextVNode.key) {
                //       // patch 更新
                //       patch(prevVNode, nextVNode, container)
                //       // 更新 source 数组
                //       source[k - nextStart] = i
                //       // 判断是否需要移动
                //       if (k < pos) {
                //         moved = true
                //       } else {
                //         pos = k
                //       }
                //     }
                //   }
                // }

                // 构建索引表
                const keyIndex = {}
                for (let i = nextStart; i <= nextEnd; i++) {
                  keyIndex[nextChildren[i].key] = i
                }
                let patched = 0
                // 遍历旧 children 的剩余未处理节点
                for (let i = prevStart; i <= prevEnd; i++) {
                  prevVNode = prevChildren[i]

                  if (patched < nextLeft) {
                    // 通过索引表快速找到新 children 中具有相同 key 的节点的位置
                    const k = keyIndex[prevVNode.key]
                    if (typeof k !== 'undefined') {
                      nextVNode = nextChildren[k]
                      // patch 更新
                      patch(prevVNode, nextVNode, container)
                      patched++
                      // 更新 source 数组
                      source[k - nextStart] = i
                      // 判断是否需要移动
                      if (k < pos) {
                        moved = true
                      } else {
                        pos = k
                      }
                    } else {
                      // 没找到，说明旧节点在新 children 中已经不存在了，应该移除
                      container.removeChild(prevVNode.el)
                    }
                  } else {
                    // 多余的节点，应该移除
                    container.removeChild(prevVNode.el)
                  }
                }
              }
              break
            }
          break
      }
      break
  }
}

function patchText(prevVNode, nextVNode) {
  // 拿到文本节点 el，同时让 nextVNode.el 指向该文本节点
  const el = (nextVNode.el = prevVNode.el)
  // 只有当新旧文本内容不一致时才有必要更新
  if (nextVNode.children !== prevVNode.children) {
    el.nodeValue = nextVNode.children
  }
}

function patchFragment(prevVNode, nextVNode, container) {
  console.log(prevVNode, nextVNode, 12312312)
  // 直接调用 patchChildren 函数更新 新旧片段的子节点即可
  patchChildren(
    prevVNode.childFlags, // 旧片段的子节点类型
    nextVNode.childFlags, // 新片段的子节点类型
    prevVNode.children,   // 旧片段的子节点
    nextVNode.children,   // 新片段的子节点
    container
  )

  switch (nextVNode.childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      nextVNode.el = nextVNode.children.el
      break
    case ChildrenFlags.NO_CHILDREN:
      nextVNode.el = prevVNode.el
      break
    default:
      nextVNode.el = nextVNode.children[0].el
  }
}


function patchPortal(prevVNode, nextVNode) {
  patchChildren(
    prevVNode.childFlags,
    nextVNode.childFlags,
    prevVNode.children,
    nextVNode.children,
    prevVNode.tag // 注意 container 是旧的 container
  )
  // 让 nextVNode.el 指向 prevVNode.el
  nextVNode.el = prevVNode.el

  // 如果新旧容器不同，才需要搬运
  if (nextVNode.tag !== prevVNode.tag) {
    // 获取新的容器元素，即挂载目标
    const container =
      typeof nextVNode.tag === 'string'
        ? document.querySelector(nextVNode.tag)
        : nextVNode.tag

    switch (nextVNode.childFlags) {
      case ChildrenFlags.SINGLE_VNODE:
        // 如果新的 Portal 是单个子节点，就把该节点搬运到新容器中
        container.appendChild(nextVNode.children.el)
        break
      case ChildrenFlags.NO_CHILDREN:
        // 新的 Portal 没有子节点，不需要搬运
        break
      default:
        // 如果新的 Portal 是多个子节点，遍历逐个将它们搬运到新容器中
        for (let i = 0; i < nextVNode.children.length; i++) {
          container.appendChild(nextVNode.children[i].el)
        }
        break
    }
  }
}

function mountStatefulComponent(vnode, container, isSVG) {
  // 创建组件实例
   // 创建组件实例
   const instance = (vnode.children = new vnode.tag())
   // 初始化 props
   instance.$props = vnode.data

  instance._update = function() {
    // 如果 instance._mounted 为真，说明组件已挂载，应该执行更新操作
    if (instance._mounted) {
      // 1、拿到旧的 VNode
      const prevVNode = instance.$vnode
      // 2、重渲染新的 VNode
      const nextVNode = (instance.$vnode = instance.render())
      // 3、patch 更新
      patch(prevVNode, nextVNode, prevVNode.el.parentNode)
      // 4、更新 vnode.el 和 $el
      instance.$el = vnode.el = instance.$vnode.el
    } else {
      // 1、渲染VNode
      instance.$vnode = instance.render()
      // 2、挂载
      mount(instance.$vnode, container, isSVG)
      // 3、组件已挂载的标识
      instance._mounted = true
      // 4、el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素
      instance.$el = vnode.el = instance.$vnode.el
      // 5、调用 mounted 钩子
      instance.mounted && instance.mounted()
    }
  }

  instance._update()
}

function patchComponent(prevVNode, nextVNode, container) {
  // tag 属性的值是组件类，通过比较新旧组件类是否相等来判断是否是相同的组件
  if (nextVNode.tag !== prevVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    // 获取组件实例
    const instance = (nextVNode.children = prevVNode.children)
    // 更新 props
    instance.$props = nextVNode.data
    // 更新组件
    instance._update()
  } else {
     // 更新函数式组件
    // 通过 prevVNode.handle 拿到 handle 对象
    const handle = (nextVNode.handle = prevVNode.handle)
    // 更新 handle 对象
    handle.prev = prevVNode
    handle.next = nextVNode
    handle.container = container

    // 调用 update 函数完成更新
    handle.update()
  }
}


function mountFunctionalComponent(vnode, container, isSVG) {
  vnode.handle = {
    prev: null,
    next: vnode,
    container,
    update: () => {
      if (vnode.handle.prev) {
        // 更新
        // prevVNode 是旧的组件VNode，nextVNode 是新的组件VNode
        const prevVNode = vnode.handle.prev
        const nextVNode = vnode.handle.next
        // prevTree 是组件产出的旧的 VNode
        const prevTree = prevVNode.children
        // 更新 props 数据
        const props = nextVNode.data
        // nextTree 是组件产出的新的 VNode
        const nextTree = (nextVNode.children = nextVNode.tag(props))
        // 调用 patch 函数更新
        patch(prevTree, nextTree, vnode.handle.container)
      } else {
        // 获取 props
        const props = vnode.data
        // 获取 VNode
        const $vnode = (vnode.children = vnode.tag(props))
        // 挂载
        mount($vnode, container, isSVG)
        // el 元素引用该组件的根元素
        vnode.el = $vnode.el
      }
    }
  }

  // 立即调用 vnode.handle.update 完成初次挂载
  vnode.handle.update()
}