"use client";
import {useState , useEffect} from 'react'
import CreateServerModal from '../modals/CreateServer';

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <CreateServerModal />
  )
}

export default ModalProvider