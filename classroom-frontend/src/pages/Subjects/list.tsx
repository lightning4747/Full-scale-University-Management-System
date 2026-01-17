import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { Input } from '@/components/ui/input'
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from '@/components/ui/select'
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { DEPARTMENT_OPTIONS } from '@/constants'

const SubjectsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  return (
    <ListView>
      <Breadcrumb />

      <h1 className='page-title'>Subjects</h1>

      <div className='intro-row'>
        <p>Quick acces to essential metrics and management tools.</p>

        <div className='action-row flex-col'>
          <div className='search-field'>
            <Search className='search-icon'/>

            <Input type="text" 
                placeholder='Search by name...' 
                className='pl-10 w-full'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='flex items-center gap-2 w:full sm:w-auto mt-4'>
            <Select 
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder='Filter by department' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>
                  All Departments
                </SelectItem>
                {
                  DEPARTMENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </ListView>
  )
}

export default SubjectsList
