<template>
  <div class="text-editor-wrapper">
    <div :id="editorId" class="text-editor"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Enter text here...'
  },
  height: {
    type: String,
    default: '200px'
  }
})

const emit = defineEmits(['update:modelValue'])

const editorId = ref(`editor-${Math.random().toString(36).substr(2, 9)}`)
let quill = null

onMounted(() => {
  // Load Quill CSS
  if (!document.querySelector('#quill-css')) {
    const link = document.createElement('link')
    link.id = 'quill-css'
    link.rel = 'stylesheet'
    link.href = '/dashboard-assets/libs/quill/quill.snow.css'
    document.head.appendChild(link)
  }

  // Load Quill JS
  if (typeof Quill === 'undefined') {
    const script = document.createElement('script')
    script.src = '/dashboard-assets/libs/quill/quill.min.js'
    script.onload = initQuill
    document.head.appendChild(script)
  } else {
    initQuill()
  }
})

function initQuill() {
  const toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['image', 'video'],
    ['clean']
  ]

  quill = new Quill(`#${editorId.value}`, {
    modules: {
      toolbar: toolbarOptions
    },
    theme: 'snow',
    placeholder: props.placeholder
  })

  // Set initial content
  if (props.modelValue) {
    quill.root.innerHTML = props.modelValue
  }

  // Listen for text changes
  quill.on('text-change', () => {
    const html = quill.root.innerHTML
    emit('update:modelValue', html)
  })
}

watch(() => props.modelValue, (newValue) => {
  if (quill && newValue !== quill.root.innerHTML) {
    quill.root.innerHTML = newValue
  }
})

onUnmounted(() => {
  if (quill) {
    quill = null
  }
})
</script>

<style scoped>
.text-editor-wrapper {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
}

.text-editor {
  height: v-bind(height);
  max-height: v-bind(height);
  overflow: auto;
}

:deep(.ql-editor) {
  min-height: v-bind(height);
  max-height: v-bind(height);
  overflow: auto;
  font-size: 14px;
}

:deep(.ql-toolbar) {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #ced4da;
}

:deep(.ql-container) {
  border: none;
}
</style> 