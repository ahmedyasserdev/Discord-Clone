import NavigationSidebar from '@/components/navigation/NavigationSidebar'


const MainLayout = ({children } : {children : React.ReactNode}) => {


  return (
    <div className = "h-full">
                <div className=" invisible  md:visible h-full w-[72px] z-30  fixed inset-y-0">
        <NavigationSidebar />
      </div>
       <main className='md:pl-[72px] h-full' >
       {children}
       </main>

    </div>
  )
}

export default MainLayout 