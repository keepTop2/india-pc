import { createVNode, render } from "vue";

export default function renderComponent({
  el,
  component,
  props = {},
  appContext,
}) {
  let element = el;
  let clearCreateElement = () => {};
  if (!element) {
    const div = document.createElement("div");
    document.querySelector("#app").appendChild(div);
    element = div;
    clearCreateElement = () => {
      div.remove();
    };
  }

  props.destroy = () => {
    render(null, element);
    clearCreateElement();
  };
  let vnode = createVNode(component, props);
  vnode.appContext = { ...appContext };
  render(vnode, element);

  return () => {
    // destroy component
    render(null, element);
    vnode = undefined;
    clearCreateElement();
  };
}
