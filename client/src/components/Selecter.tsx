import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Selecter() {
  return (
    <div className="flex items-center justify-center ">
      <Tabs defaultValue="account" className="w-[400px] bg-gray-800 p-6 rounded-lg shadow-lg">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}

export default Selecter;
