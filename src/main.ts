import { reactive, effect, computed } from './reactivity';
const obj = reactive({
  flag: true,
  son: {
    value: 1
  },
  foo: 1,
  x: 1,
  y: 2
});

(window as any).__obj__ = obj;

const double = computed(() => {
  console.log('computed~~~~');
  return obj.foo * 2;
});
(window as any).__double__ = double;
effect(function render() {
  console.log('render~~~~~~');
  // effect(() => {
  //   console.log('类比--子组件', obj.foo);
  // });
  // document.body.innerHTML = `
  //   <div>${obj.son.value}</div>
  //   xxxxxxxxxxxxxxxx--->${obj.flag ? obj.x : obj.y}
  // `;
  document.body.innerHTML = `
    <div>foo:${obj.foo}</div>
    <div>compued:douobulefoo--->${double.value}</div>
  `;
});
