'use client'
import React, { useEffect, useState } from 'react';
import { Search, Plus, Bell, Settings, GitBranch, Star, GitPullRequest, Code, BookOpen, Filter, TrendingUp, Sun, Moon, Menu, X } from 'lucide-react';
import GradientTitle from '@/components/GradientTitle';
import Feed from '@/components/Feed';
import LastChanged from '@/components/LastChanged';
// import GradientButton from './GradientButton';
import GradientButton from '@/components/GradientButton';
import ProjectMenu from '@/components/ProjectMenu';
import Link from 'next/link'
import { useAuth, useUser } from '@clerk/nextjs';
import { GetAllProjects } from '@/lib/actions/projects.actions';
import { redirect } from 'next/dist/server/api-utils';
import { Project } from '@/interfaces';
import { toast } from 'sonner';

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {isLoaded, isSignedIn} = useAuth()
  const {user} = useUser()
  const [projects, setProjects] = useState<Project[]>([]);
  const [latestProject, setLatestProject] = useState<Project>();
  const findLatest = (data: Project[])=> {
    let latest = data[0]
      for (let i = 1; i < data.length; i++) {
        if(data[i].updated_at && latest.updated_at){
          console.log(data[i])
          if(data[i])
           if(new Date(data[i].updated_at).getTime() > new Date(latest.updated_at).getTime()){
              latest = data[i]
          }
        }
      }
        return latest;
  }
  const repositories = [
    { name: 'WhiteBoard', owner: 'Akshay-Diwan' },
    { name: 'hackathon-banking', owner: 'Akshay-Diwan' },
    { name: 'DVPGame', owner: 'Akshay-Diwan' },
    { name: 'CanvasAppFrontend', owner: 'Akshay-Diwan' },
    { name: 'trial', owner: 'Akshay-Diwan' },
    { name: 'Game1', owner: 'Akshay-Diwan' },
    { name: 'inotebook', owner: 'Akshay-Diwan' },
  ];

  const trendingRepos = [
    {
      name: 'Gar-b-age/CookLikeHOC',
      description: '🍳 怎么去🐔，那样做饭呢。主要给分于2024年完工，非老乡鸡百万仓库。文字来自《老乡鸡来品牌服务报告》，并做明确认、编辑与整理。CookLikeHOC。',
      language: 'JavaScript',
      stars: '17.2k'
    },
    {
      name: 'Wan-Video/Wan2.2',
      description: 'Wan: Open and Advanced Large-Scale Video Generative Models',
      language: 'Python',
      stars: '8.1k'
    }
  ];



  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const themeClasses = isDarkMode 
    ? 'bg-[#07070C] text-gray-100' 
    : 'bg-white text-gray-900';
  
  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  const inputClasses = isDarkMode
    ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

    useEffect(()=>{
      if(user?.id){
        GetAllProjects(user?.id)
        .then(data => {
          setProjects(data)
          setLatestProject(findLatest(data))
      })
        .catch((err) => {
          console.log(err)
          toast("failed to fetch projects")
      })
      }
    },[user])
  return (
    <div className={`min-h-screen ${themeClasses} transition-colors duration-200`}>
      {/* Header */}
      <header className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} px-4 py-3`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md hover:bg-gray-700"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-lg hidden sm:block">Dashboard</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Type / to search"
                className={`w-full pl-10 pr-4 py-2 rounded-md border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-md hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button className={`p-2 rounded-md hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Plus className="h-5 w-5" />
            </button>
            <button className={`p-2 rounded-md hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Bell className="h-5 w-5" />
            </button>
            <button className={`p-2 rounded-md hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Settings className="h-5 w-5" />
            </button>
            {
              isSignedIn?
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
              :
              <Link href={'/sign-in'}><GradientButton className='w-8 h-10 flex justify-center items-center' >Sign-in</GradientButton></Link>
            }
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto justify-center">

        {/* Sidebar */}
        {
          isSignedIn&&
           <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-30 w-80 h-screen md:h-auto ${themeClasses} transition-transform duration-300 border-r ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} p-6 overflow-y-auto`}>
          <ProjectMenu projects={projects} isDarkMode={isDarkMode} inputClasses={inputClasses}/>
        </aside>
        
        }
       

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main Content */}
        <main className={`${isSignedIn?'flex-1':'w-200'} p-6`}>
          <GradientTitle/>
         

          {/* Home Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-6">Home</h1>
            
            {/* Copilot Input */}
            <div className={`${cardClasses} border rounded-lg p-4 mb-6`}>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Ask Copilot"
                  className={`flex-1 px-3 py-2 rounded-md border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                <button className="p-2 text-gray-400 hover:text-gray-300">
                  →
                </button>
              </div>
            </div>
            <Link href={isSignedIn?'/project/new-project': '/sign-in'}>
            <GradientButton>
              <div className='flex justify-between items-center gap-1'>
              <span className='text-nowrap'>Create New </span>
              <Plus/>
              </div>
              </GradientButton>
            </Link>

           
          </div>
          {
            isSignedIn && latestProject &&
            <LastChanged latest_project={latestProject}/>
          }
            <Feed isDarkMode={isDarkMode} trendingRepos={trendingRepos}/>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
