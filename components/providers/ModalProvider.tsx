"use client";
import {useState , useEffect} from 'react'
import CreateServerModal from '@/components/modals/CreateServer';
import InviteModal from '@/components/modals/InviteModal';
import EditServerModal from '@/components/modals/EditServerModal';
import MembersModal from '@/components/modals/MembersModal';
import CreateChannelModal from '@/components/modals/CreateChannel';
import LeaveServerModal from '@/components/modals/LeaveServer';
import DeleteServerModal from '../modals/DeleteServer';
import DeleteChannelModal from '../modals/DeleteChannel';
import EditChannelModal from '../modals/EditChannel';

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
    <CreateChannelModal/>
    <LeaveServerModal />
    <DeleteServerModal />
    <DeleteChannelModal/>
    <EditChannelModal />
    </>
  )
}

export default ModalProvider