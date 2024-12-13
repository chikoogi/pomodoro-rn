export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface Todo {
  id: string
  title: string
  description: string
  dueDate: Date | null
  priority: Priority
  isCompleted: boolean
  createdAt: Date
  updatedAt: Date
  pomodoroCount: number
}

export interface TodoFilter {
  priority?: Priority
  showCompleted: boolean
}

export interface CreateTodoInput {
  title: string
  description: string
  dueDate: Date | null
  priority: Priority
}

export type UpdateTodoInput = Partial<Omit<Todo, 'id' | 'createdAt'>>
