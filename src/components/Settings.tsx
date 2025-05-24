
import { ArrowLeft, Building, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SettingsProps {
  onNavigate: (screen: string) => void;
}

export const Settings = ({ onNavigate }: SettingsProps) => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" defaultValue="Furaha" />
            </div>
            <div>
              <Label htmlFor="businessPhone">Business Phone</Label>
              <Input id="businessPhone" placeholder="Enter your business phone" />
            </div>
            <div>
              <Label htmlFor="businessEmail">Business Email</Label>
              <Input id="businessEmail" type="email" placeholder="Enter your business email" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loyalty Program Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="visitsRequired">Visits Required for Reward</Label>
              <Input id="visitsRequired" type="number" defaultValue="5" />
            </div>
            <div>
              <Label htmlFor="rewardDescription">Reward Description</Label>
              <Input id="rewardDescription" defaultValue="Free Service" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="welcomeMessage">Welcome Message Template</Label>
              <Input 
                id="welcomeMessage" 
                defaultValue="Thanks for visiting Furaha! Visit 4 more times and your next service is FREE! ✨"
              />
            </div>
            <div>
              <Label htmlFor="progressMessage">Progress Message Template</Label>
              <Input 
                id="progressMessage" 
                defaultValue="That's visit #{count}, {name}! Just {remaining} more for your free service 🎉"
              />
            </div>
          </CardContent>
        </Card>

        <Button className="w-full">Save Settings</Button>
      </div>
    </div>
  );
};
