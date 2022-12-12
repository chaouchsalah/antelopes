import create from 'zustand'
import { Antelope } from '../utils/constants'

interface DataState {
  data: Array<Antelope>;
  set: (data: Array<Antelope>) => void
}

export const useDataStore = create<DataState>()((set) => ({
  data: [],
  set: (data: Array<Antelope>) => set(() => ({ data })),
}))
