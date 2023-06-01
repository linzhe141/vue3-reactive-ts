type EffectScheduler = (...args: any[]) => any;
type ReactiveEffectOptions = {
  lazy?: boolean;
  scheduler?: EffectScheduler;
};

export let activeEffect: ReactiveEffect | undefined;
const effectStack: ReactiveEffect[] = [];
export function effect(fn: () => any, options?: ReactiveEffectOptions) {
  const _effect = new ReactiveEffect(fn, options);
  // lazy 为true表示不会立即执行，只有真正使用的时候，才执行，比如计算属性
  if (!options?.lazy) {
    _effect.run();
  }
}

export class ReactiveEffect {
  deps: Set<any>[] = [];
  fn: () => any = () => {};
  scheduler: EffectScheduler | null = null;
  constructor(fn: () => any, options?: ReactiveEffectOptions) {
    this.fn = fn;
    if (options?.scheduler) {
      this.scheduler = options.scheduler;
    }
  }
  run() {
    cleanUp(this);
    activeEffect = this;
    effectStack.push(activeEffect);
    // 执行这个函数,就会取值进行依赖收集
    const value = this.fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return value;
  }
}

// 重新依赖收集之前，去掉各个属性对应的activeEffect，每次用最新的
function cleanUp(effect: ReactiveEffect) {
  const deps = effect.deps;
  for (let i = 0; i < deps.length; i++) {
    const dep = deps[i];
    dep.delete(effect);
  }
  deps.length = 0;
}
