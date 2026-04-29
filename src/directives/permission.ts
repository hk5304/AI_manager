import { Directive, DirectiveBinding } from 'vue'
import usePermission from '../composables/usePermission'

const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { hasPermission } = usePermission()
    const permission = binding.value

    if (permission && !hasPermission(permission)) {
      el.style.display = 'none'
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const { hasPermission } = usePermission()
    const permission = binding.value

    if (permission && !hasPermission(permission)) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
    }
  }
}

export default permissionDirective