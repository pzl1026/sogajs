import { h, Fragment, Portal } from '../src/h'
import { Component } from '../src/component'

// const elementVNode = h('div', null, h('span'))
// console.log(elementVNode)

// const elementWithTextVNode = h('div', null, '我是文本')
// console.log(elementWithTextVNode)

// const fragmentVNode = h(Fragment, null, [h('h1'), h('h1')])
// console.log(fragmentVNode)

// const portalVNode = h(
//   Portal,
//   {
//     target: '#box'
//   },
//   h('h1')
// )
// console.log(portalVNode)

// // 一个函数式组件
// function MyFunctionalComponent() {}
// // 传递给 h 函数的第一个参数就是组件函数本身
// const functionalComponentVNode = h(MyFunctionalComponent, null, h('div'))
// console.log(functionalComponentVNode)

// // 有状态组件
// class MyStatefulComponent extends Component {}
// const statefulComponentVNode = h(MyStatefulComponent, null, h('div'))
// console.log(JSON.stringify(statefulComponentVNode))

// const a = {
//   _isVNode: true,
//   flags: 4,
//   data: null,
//   children: {
//     _isVNode: true,
//     flags: 1,
//     tag: 'div',
//     data: null,
//     children: null,
//     childFlags: 1
//   },
//   childFlags: 2
// }
///////////////////
import render from '../src/render'

// const elementVnode = h(
//   'div',
//   {
//     style: {
//       height: '100px',
//       width: '100px',
//       background: 'red'
//     }
//   },
//   h('div', {
//     style: {
//       height: '50px',
//       width: '50px',
//       background: 'green'
//     }
//   })
// )

// render(elementVnode, document.getElementById('app'))

/////////////////////
// const dynamicClass = ['class-b', 'class-c']

// const elementVnode2 = h('div', {
//   class: ['class-a', ...dynamicClass]
// })

// render(elementVnode2, document.getElementById('app'))
///////////////////
// const elementVnode = h('input', {
//     class: 'cls-a',
//     type: 'checkbox',
//     checked: true,
//     custom: '1'
//   })
  
// render(elementVnode, document.getElementById('app'))
/////////////

// function handler() {
//     alert('click me')
//   }
  
//   const elementVnode = h('div', {
//     style: {
//       width: '100px',
//       height: '100px',
//       backgroundColor: 'red'
//     },
//     onclick: handler
//   }, '我是文本')
  
// render(elementVnode, document.getElementById('app'))
///////////////
// const elementVNode = h(
//     'div',
//     {
//       style: {
//         height: '100px',
//         width: '100px',
//         background: 'red'
//       }
//     },
//     h(Fragment, null, [
//       h('span', null, '我是标题1......'),
//       h('span', null, '我是标题2......')
//     ])
//   )
//   render(elementVNode, document.getElementById('app'))
  /////////
//   const elementVNode = h(
//     'div',
//     {
//       style: {
//         height: '100px',
//         width: '100px',
//         background: 'red'
//       }
//     },
//     h(Portal, { target: '#portal-box' }, [
//       h('span', null, '我是标题1......'),
//       h('span', null, '我是标题2......')
//     ])
//   )
//   render(elementVNode, document.getElementById('app'))
//////////////////

// class MyComponent {
//     render() {
//       return h(
//         'div',
//         {
//           style: {
//             background: 'green'
//           }
//         },
//         [
//           h('span', null, '我是组件的标题1......'),
//           h('span', null, '我是组件的标题2......')
//         ]
//       )
//     }
// }
// render(h(MyComponent), document.getElementById('app'))

///////////
// function MyFunctionalComponent() {
//     return h(
//       'div',
//       {
//         style: {
//           background: 'green'
//         }
//       },
//       [
//         h('span', null, '我是组件的标题1......'),
//         h('span', null, '我是组件的标题2......')
//       ]
//     )
//   }
  
//   const compVnode = h(MyFunctionalComponent)
//   render(compVnode, document.getElementById('app'))

//////patch//////////
// const prevVNode = h('div', null, '旧的 VNode')

// class MyComponent {
//   render() {
//     return h('div', null, '新的 VNode')
//   }
// }
// const nextVNode = h(MyComponent)

// render(prevVNode, document.getElementById('app'))

// render(nextVNode, document.getElementById('app'))
///////////////////

// 旧的 VNode
// const prevVNode = h('div', {
//     style: {
//       width: '100px',
//       height: '100px',
//       backgroundColor: 'red'
//     }
//   })
  
//   // 新的 VNode
//   const nextVNode = h('div', {
//     style: {
//       width: '100px',
//       height: '100px',
//       border: '1px solid green'
//     }
//   })
  
//   render(prevVNode, document.getElementById('app'))
  
//   // 2秒后更新
//   setTimeout(() => {
//     render(nextVNode, document.getElementById('app'))
//   }, 2000)
/////////////////
// 旧的 VNode
// const prevVNode = h(
//     'div',
//     null,
//     h('p', {
//       style: {
//         height: '100px',
//         width: '100px',
//         background: 'red'
//       }
//     })
//   )
  
//   // 新的 VNode
//   const nextVNode = h(
//     'div',
//     null,
//     h('p', {
//       style: {
//         height: '100px',
//         width: '100px',
//         background: 'green'
//       }
//     })
//   )
  
//   render(prevVNode, document.getElementById('app'))
  
//   // 2秒后更新
//   setTimeout(() => {
//     render(nextVNode, document.getElementById('app'))
//   }, 2000)
  ///////////////
  // 旧的 VNode
// const prevVNode = h(
//     'div',
//     null,
//     h('p', {
//       style: {
//         height: '100px',
//         width: '100px',
//         background: 'red'
//       }
//     })
//   )
  
//   // 新的 VNode
//   const nextVNode = h('div')
  
//   render(prevVNode, document.getElementById('app'))
  
//   // 2秒后更新
//   setTimeout(() => {
//     render(nextVNode, document.getElementById('app'))
//   }, 2000)
/////////////////////
// // 旧的 VNode
// const prevVNode = h('div', null, h('p', null, '只有一个子节点'))

// // 新的 VNode
// const nextVNode = h('div', null, [
//   h('p', null, '子节点 1'),
//   h('p', null, '子节点 2')
// ])

// render(prevVNode, document.getElementById('app'))

// // 2秒后更新
// setTimeout(() => {
//   render(nextVNode, document.getElementById('app'))
// }, 2000)
/////////////
// 旧的 VNode
// const prevVNode = h(
//     'div',
//     null,
//     h('p', {
//       style: {
//         height: '100px',
//         width: '100px',
//         background: 'red'
//       }
//     })
//   )
  
//   // 新的 VNode
//   const nextVNode = h('div')
  
//   render(prevVNode, document.getElementById('app'))
  
//   // 2秒后更新
//   setTimeout(() => {
//     render(nextVNode, document.getElementById('app'))
//   }, 2000)
////////////////////
// 旧的 VNode
// const prevVNode = h('p', null, '旧文本')

// // 新的 VNode
// const nextVNode = h('p', null, '新文本')

// render(prevVNode, document.getElementById('app'))

// // 2秒后更新
// setTimeout(() => {
//   render(nextVNode, document.getElementById('app'))
// }, 2000)
//////////////////////
// 旧的 VNode
// const prevVNode = h(Fragment, null, [
//     h('p', null, '旧片段子节点 1'),
//     h('p', null, '旧片段子节点 2')
//   ])
  
//   // 新的 VNode
//   const nextVNode = h(Fragment, null, [
//     h('p', null, '新片段子节点 1'),
//     h('p', null, '新片段子节点 2')
//   ])
  
//   render(prevVNode, document.getElementById('app'))
  
//   // 2秒后更新
//   setTimeout(() => {
//     render(nextVNode, document.getElementById('app'))
//   }, 2000)
  ///////////////
  // 旧的 VNode
// const prevVNode = h(
//     Portal,
//     { target: '#old-container' },
//     h('p', null, '旧的 Portal')
//   )
  
//   // 新的 VNode
//   const nextVNode = h(
//     Portal,
//     { target: '#new-container' },
//     h('p', null, '新的 Portal')
//   )
  
//   render(prevVNode, document.getElementById('app'))
  
//   // 2秒后更新
//   setTimeout(() => {
//     render(nextVNode, document.getElementById('app'))
//   }, 2000)
/////////////////////
// 组件类
// class MyComponent {
//     localState = 'one'
  
//     mounted() {
//       setTimeout(() => {
//         this.localState = 'two'
//         this._update()
//       }, 2000)
//     }
  
//     render() {
//       return h('div', null, this.localState)
//     }
//   }
//   // 有状态组件 VNode
//   const compVNode = h(MyComponent)
  
//   render(compVNode, document.getElementById('app'))
/////////////////////
// 子组件类
// class ChildComponent {
//     render() {
//       // 子组件中访问外部状态：this.$props.text
//       return h('div', null, this.$props.text)
//     }
//   }
//   // 父组件类
//   class ParentComponent {
//     localState = 'one'
  
//     render() {
//       return h(ChildComponent, {
//         // 父组件向子组件传递的 props
//         text: this.localState
//       })
//     }
//   }
  
//   // 有状态组件 VNode
//   const compVNode = h(ParentComponent)
//   render(compVNode, document.getElementById('app'))
///////////////////
// class ChildComponent {
//     render() {
//       // 子组件中访问外部状态：this.$props.text
//       return h('div', null, this.$props.text)
//     }
//   }
//   // 父组件类
//   class ParentComponent {
//     localState = 'one'

//     mounted() {
//         // 两秒钟后将 localState 的值修改为 'two'
//         setTimeout(() => {
//         this.localState = 'two'
//         this._update()
//         }, 2000)
//     }
  
//     render() {
//       return h(ChildComponent, {
//         // 父组件向子组件传递的 props
//         text: this.localState
//       })
//     }
//   }
  
//   // 有状态组件 VNode
//   const compVNode = h(ParentComponent)
//   render(compVNode, document.getElementById('app'))
////////////////////
// class ChildComponent1 {
//     render() {
//       // 子组件中访问外部状态：this.$props.text
//       return h('div', null, this.$props.text)
//     }
//   }
// class ChildComponent2 {
//     render() {
//       // 子组件中访问外部状态：this.$props.text
//       return h('div', null, 'three')
//     }
//   }
// // 父组件类
// class ParentComponent {
//     isTrue = true
//     localState = 'one'
  
//     mounted() {
//       setTimeout(() => {
//         this.isTrue = false
//         this._update()
//       }, 2000)
//     }
  
//     render() {
//       // 如果 this.isTrue 的值为真，则渲染 ChildComponent1，否则渲染 ChildComponent2
//       return this.isTrue ? h(ChildComponent1, {
//           text: this.localState
//       }) : h(ChildComponent2)
//     }
//   }
//   // 有状态组件 VNode
//   const compVNode = h(ParentComponent)
  
//   render(compVNode, document.getElementById('app'))
/////////////////
// 子组件 - 函数式组件
function MyFunctionalComp(props) {
    return h('div', null, props.text)
  }
  // 父组件的 render 函数中渲染了 MyFunctionalComp 子组件
  class ParentComponent {
    localState = 'one'
  
    mounted() {
      setTimeout(() => {
        this.localState = 'two'
        this._update()
      }, 2000)
    }
  
    render() {
      return h(MyFunctionalComp, {
        text: this.localState
      })
    }
  }
  
  // 有状态组件 VNode
  const compVNode = h(ParentComponent)
  render(compVNode, document.getElementById('app'))
  
