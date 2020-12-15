<template>
  <div class="container">
    <h2>ToDo List</h2>
    <p>共有<span class="text-primary">{{ taskCount }}</span>个任务,其中<span class="text-success">{{ state.finishedList.length }}</span>项已完成,<span class="text-success">{{ state.unFinishedList.length }}</span>项未完成</p>
    <p>未完成列表</p>
    <ul class="list-group">
      <template v-for="(item, index) in state.unFinishedList" :key=" 'un'+ index ">
        <li v-if="!item.checked" class="list-group-item" @click="handlerChecked(item, index, key)">
          <input type="checkbox" class="form-check-input" :id="'un'+ index" :checked='item.checked'>
          <label class="form-check-label" :for="'un'+ index">{{ item.name }}</label>
          <button type="button" class="btn btn-danger" style="float: right" @click.stop="deleteTask(item, index, key)">删除</button>
        </li>
      </template>
    </ul>
    <p>已完成列表</p>
    <ul class="list-group">
      <template v-for="(item, index) in state.finishedList" :key=" 'ed'+ index ">
        <li v-if="item.checked" class="list-group-item">
          <input type="checkbox" class="form-check-input" :id="'ed'+ index" :checked='item.checked' disabled>
          <label class="form-check-label" :for="'ed'+ index">{{ item.name }}</label>
        </li>
      </template>
    </ul>
    <h2>添加新的Task</h2>
    <input ref="inputTask" type="text" class="form-control" id="task" v-model="state.newTask">
    <button type="button" class="btn btn-success btn-lg btn-block" style="margin-top: 20px;" @click="addTask">添加</button>
  </div>
</template>
<script>
import { ref, reactive, computed, onMounted } from 'vue'

// 进阶处理(逻辑代码变量分离和抽取)
// 1. 输入框焦点事件
function useToInputTask(inputTask) {
  const toInputTask = () => inputTask.value.focus()
  return {
    inputTask, toInputTask
  }
}
// 2. 鼠标抬起事件,触发提交的点击事件
function useKeyUp(addTask) {
  const keyUp = () => {
    addTask()
  }
  return {
    keyUp
  }
}
// 3. 点击提交click事件
function useAddTask(state, toInputTask) {
  const addTask = () => {
    if (!state.newTask) {
      toInputTask()
      return
    }
    state.unFinishedList.push({ name: state.newTask, checked: false })
    state.newTask = ''
    toInputTask()
  }
  return {
    addTask
  }
}
// 4. 挂载完成input输入框获取焦点事件
function useGetFocus(inputTask) {
  const getFocus = onMounted(() => {
    inputTask.value.focus()
    window.addEventListener('keyup', keyUp)
  })
  return {
    getFocus
  }
}
// 5. 任务数量计算事件
function useTaskCount(state) {
  const taskCount = computed(() => {
    return state.unFinishedList.length + state.finishedList.length
  })
  return {
    taskCount
  }
}
// 6. checked表单选择事件
function useHandlerChecked(item, index, state) {
  const handlerChecked = (item, index, state) => {
    item.checked = !item.checked
    state.unFinishedList.splice(index, 1)
    state.finishedList.push(item)
  }
  return {
    handlerChecked
  }
}
// 7. 删除任务事件
function useDeleteTask(item, index, state) {
  const deleteTask = (item, index, state) => {
    state.unFinishedList.splice(index, 1)
  }
  return {
    deleteTask
  }
}

export default {
  name: 'Update',
  setup() {
    // 定义公共的变量(私有变量可定义在逻辑代码内部)
    const inputTask = ref(null)
    const state = reactive({
      unFinishedList: [],
      finishedList: [],
      newTask: ''
    })
    // 所有处理的逻辑方法(注意如果存在调用相关方法,则被调用的方法顺序一定要在前面,因为js同步代码从上往下依次执行)
    const { toInputTask } = useToInputTask(inputTask)
    const { addTask } = useAddTask(state, toInputTask)
    const { keyUp } = useKeyUp(addTask)
    const { getFocus } = useGetFocus(inputTask)
    const { taskCount } = useTaskCount(state)
    // 这里对应的模板也要传入3个参数(第3个参数随意因为会被state覆盖(这里发现编译会有bug无法识别‘keyUp, item, index, item, index’,通过重启服务可解决))
    const { handlerChecked } = useHandlerChecked(item, index, state)
    // 这里对应的模板也要传入3个参数(第3个参数随意因为会被state覆盖(这里发现编译会有bug无法识别‘keyUp, item, index, item, index’,通过重启服务可解决))
    const { deleteTask } = useDeleteTask(item, index, state)
    // 返回模板所需
    return {
      state, addTask, inputTask, getFocus, toInputTask, keyUp, deleteTask, handlerChecked, taskCount
    }
  }
}

// 最原始写法(变量逻辑代码混合)
// export default {
//   name: 'Update',
//   setup() {
//     const inputTask = ref(null)
//     const keyUp = () => {
//       addTask()
//     }
//     const toInputTask = (inputTask) => inputTask.value.focus()
//     const getFocus = onMounted(() => {
//       inputTask.value.focus()
//       window.addEventListener('keyup', keyUp)
//     })
//     const taskCount = computed(() => {
//       return state.unFinishedList.length + state.finishedList.length
//     })
//     const state = reactive({
//       unFinishedList: [
//       ],
//       finishedList: [
//       ],
//       taskCount,
//       newTask: ''
//     })
//     const handlerChecked = (item, index, state) => {
//       item.checked = !item.checked
//       state.unFinishedList.splice(index, 1)
//       state.finishedList.push(item)
//     }
//     const addTask = () => {
//       if (!state.newTask) {
//         toInputTask()
//         return
//       }
//       state.unFinishedList.push({ name: state.newTask, checked: false })
//       state.newTask = ''
//       toInputTask()
//     }
//     const deleteTask = (item, index) => {
//       state.unFinishedList.splice(index, 1)
//     }
//     return {
//       state, addTask, inputTask, getFocus, toInputTask, keyUp, deleteTask, handlerChecked
//     }
//   }
// }

</script>
