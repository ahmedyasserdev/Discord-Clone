"use client";
import {useState , useEffect} from 'react'
import CreateServerModal from '@/components/modals/CreateServer';
import InviteModal from '@/components/modals/InviteModal';
import EditServerModal from '@/components/modals/EditServerModal';
import MembersModal from '@/components/modals/MembersModal';
import CreateChannelModal from '@/components/modals/CreateChannel';
import LeaveServerModal from '@/components/modals/LeaveServer';
import DeleteServerModal from '@/components/modals/DeleteServer';
import DeleteChannelModal from '@/components/modals/DeleteChannel';
import EditChannelModal from '@/components/modals/EditChannel';
import MessageFileModal from '@/components/modals/MessageFileModal';
import { DeleteMessage } from '../modals/DeleteMessage';

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
    <MessageFileModal />
    <DeleteMessage/>
    </>
  )
}

export default ModalProvider