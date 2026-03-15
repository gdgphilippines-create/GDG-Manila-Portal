import { createNotImplementedError } from '../types'

const error = () => createNotImplementedError('firebaseProvider')

export const firebaseProvider = {
  async getActiveView() {
    throw error()
  },

  async setActiveView() {
    throw error()
  },

  subscribe() {
    throw error()
  },
}
