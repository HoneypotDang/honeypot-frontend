import { useEffect, useRef, useCallback } from 'react';

export const useOnce = (callback: Function, dependencies: any []) => {
  const isInit = useRef(false)
  useEffect(() => {
    if (!isInit.current && dependencies.every(Boolean)) {
      isInit.current = true
      callback()
    }
  }, dependencies)
}

export const useInterval = (callback: Function, interval: number) => {
  const ref = useRef<any>()
  const func =  useCallback(() =>  {
    ref.current = setTimeout(async () => {
      await callback()
      func()
    }, interval)
  }, [callback])
  useEffect(() => {
    func()
    return () => clearTimeout(ref.current)
  }, [func])
}