"use client";
import {useState , useEffect} from 'react'
import CreateServerModal from '@/components/modals/CreateServer';
import InviteModal from '@/components/modals/InviteModal';
import EditServerModal from '@/components/modals/EditServerModal';
import MembersModal from '../modals/MembersModal';

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
    <EditServerModal/>
    <MembersModal />
    </>
  )
}

export default ModalProvider