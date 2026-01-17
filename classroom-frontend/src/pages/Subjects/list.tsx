import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React, { useState } from 'react'

const SubjectsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <ListView>
      <Breadcrumb />

      <h1 className='page-title'>Subjects</h1>

      <div className='intro-row'>
        <p>Quick acces to essential metrics and management tools.</p>

        <div className='action-row'>
          <div className='search-field'>
            <Search className='search-icon'/>

            <Input type="text" 
                placeholder='Search by name...' 
                className='pl-10 w-full'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
    </ListView>
  )
}

export default SubjectsList
