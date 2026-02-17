import { type Component, ref, type Ref } from 'vue';
import { mount, VueWrapper } from '@vue/test-utils';

export function mountWithModel<T>(component: Component, initialModel: T):
  { wrapper: VueWrapper; modelRef: Ref<T> } {
  const modelRef = ref(initialModel) as Ref<T>;

  const wrapper = mount(component, {
    props: {
      modelValue: modelRef.value,
      'onUpdate:modelValue': (e: T) => {
        modelRef.value = e;
        wrapper.setProps({ modelValue: e });
      }
    }
  });
  return {wrapper, modelRef};
}
