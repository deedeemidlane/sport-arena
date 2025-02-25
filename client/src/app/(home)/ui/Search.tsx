
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  return (
    <div className="container mx-auto py-12">
      <div className="glass-effect rounded-xl p-6 flex gap-4 items-end">
        <div className="flex-1">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="volleyball">Volleyball</SelectItem>
              <SelectItem value="pickleball">Pickle Ball</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select province" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="province1">Province 1</SelectItem>
              <SelectItem value="province2">Province 2</SelectItem>
              <SelectItem value="province3">Province 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="district1">District 1</SelectItem>
              <SelectItem value="district2">District 2</SelectItem>
              <SelectItem value="district3">District 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <SearchIcon className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default Search;
