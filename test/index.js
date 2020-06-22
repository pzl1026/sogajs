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
