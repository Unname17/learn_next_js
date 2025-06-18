import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRightIcon } from "lucide-react";
import React from "react";

const ButtonExample = () => {
  return (
    <div>
      ButtonExample
      <Button variant="destructive">Button</Button>
      <Button variant="secondary" size="icon" className="bg-orange-700 size-8">
      <ChevronRightIcon />
    </Button>

    <Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
    </div>
  );
};

export default ButtonExample;