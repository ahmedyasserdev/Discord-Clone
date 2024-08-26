"use client";
import {useState , useEffect} from 'react'
import CreateServerModal from '@/components/modals/CreateServer';
import InviteModal from '@/components/modals/InviteModal';

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
    <CreateServerModal />
    <InviteModal/>
    </>
  )
}

export default ModalProvider