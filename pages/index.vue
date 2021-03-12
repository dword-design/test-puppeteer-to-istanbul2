<template>
  <div class="foo">{{ foo }}</div>
</template>

<script>
import self from '@/model/foo'

export default {
  computed: {
    foo: () => self.foo(),
  },
}
</script>
