<template>
  <div class="container">
    <h2>ToDo List</h2>
    <p>共有<span class="text-primary">{{ state.taskCount }}</span>个任务,其中<span class="text-success">{{ state.finishedList.length }}</span>项已完成,<span class="text-success">{{ state.unFinishedList.length }}</span>项未完成</p>
    <p>未完成列表</p>
    <ul class="list-group">
      <template v-for="(item, index) in state.unFinishedList" :key=" 'un'+ index ">
        <li v-if="!item.checked" class="list-group-item" @click="handlerChecked(item, index)">
          <input type="checkbox" class="form-check-input" :id="'un'+ index" :checked='item.checked'>
          <label class="form-check-label" :for="'un'+ index">{{ item.name }}</label>
          <button type="button" class="btn btn-danger" style="float: right" @click.stop="deleteTask(item, index)">删除</button>
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
export default {
  name: 'Home',
  setup() {
    const inputTask = ref(null)
    const keyUp = () => {
      addTask()
    }
    const toInputTask = () => {
      inputTask.value.focus()
    }
    const getFocus = onMounted(() => {
      inputTask.value.focus()
      window.addEventListener('keyup', keyUp)
    })
    const taskCount = computed(() => {
      return state.unFinishedList.length + state.finishedList.length
    })
    const state = reactive({
      unFinishedList: [
      ],
      finishedList: [
      ],
      taskCount,
      newTask: ''
    })
    const handlerChecked = (item, index) => {
      item.checked = !item.checked
      state.unFinishedList.splice(index, 1)
      state.finishedList.push(item)
    }
    const addTask = () => {
      if (!state.newTask) {
        toInputTask()
        return
      }
      state.unFinishedList.push({ name: state.newTask, checked: false })
      state.newTask = ''
      toInputTask()
    }
    const deleteTask = (item, index) => {
      state.unFinishedList.splice(index, 1)
    }
    return {
      state, handlerChecked, addTask, inputTask, getFocus, toInputTask, keyUp, deleteTask
    }
  }
}
</script>
