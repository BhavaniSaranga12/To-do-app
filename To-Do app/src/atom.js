// atoms.js
import { atom } from 'recoil';


export const loginStateAtom = atom({
  key: 'loginState',
  default: false,      
});

export const todoStateAtom = atom({
  key: 'todoState', 
  default: [],
});

export const userStateAtom= atom({
  key: 'login',
  default:'',
})