import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Lock, Eye } from "lucide-react"

export function PersonalDetailsTab({ isNew = false }: { isNew?: boolean }) {
  return (
    <div className="space-y-8">
      {/* Section 1: Contact Information */}
      <section className="border border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          Contact Information
        </h2>
        <div className="space-y-5">
          <div>
            <Label htmlFor="street-address" className="text-sm font-medium text-gray-700 mb-2 block">
              Street Address
            </Label>
            <Input id="street-address" defaultValue={isNew ? "" : "123 Main Street"} className="h-10" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="suburb" className="text-sm font-medium text-gray-700 mb-2 block">
                Suburb
              </Label>
              <Input id="suburb" defaultValue={isNew ? "" : "Manhattan"} className="h-10" />
            </div>
            <div>
              <Label htmlFor="city" className="text-sm font-medium text-gray-700 mb-2 block">
                City
              </Label>
              <Input id="city" defaultValue={isNew ? "" : "New York"} className="h-10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="postal-code" className="text-sm font-medium text-gray-700 mb-2 block">
                Postal Code
              </Label>
              <Input id="postal-code" defaultValue={isNew ? "" : "10001"} className="h-10" />
            </div>
            <div>
              <Label htmlFor="contact-number" className="text-sm font-medium text-gray-700 mb-2 block">
                Contact Number
              </Label>
              <Input id="contact-number" defaultValue={isNew ? "" : "+1 (555) 123-4567"} className="h-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="id-number" className="text-sm font-medium text-gray-700 mb-2 block">
              ID Number
            </Label>
            <Input id="id-number" defaultValue={isNew ? "" : "123-45-6789"} className="h-10" />
          </div>
        </div>
      </section>

      {/* Section 2: Personal Information */}
      <section className="border border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          Personal Information
        </h2>
        <div className="space-y-5">
          <div>
            <Label htmlFor="dob" className="text-sm font-medium text-gray-700 mb-2 block">
              Date of Birth
            </Label>
            <div className="flex items-center gap-4">
              <Input id="dob" type="date" defaultValue="1985-05-20" className="h-10 flex-1" />
              <div className="flex items-center space-x-2">
                <Checkbox id="birthday-notifications" defaultChecked />
                <Label htmlFor="birthday-notifications" className="font-normal cursor-pointer">
                  Send birthday notifications
                </Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Sex</Label>
            <RadioGroup defaultValue="male" className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">
                  Male
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">
                  Female
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-specified" id="not-specified" />
                <Label htmlFor="not-specified" className="font-normal cursor-pointer">
                  Not Specified
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="marital-status" className="text-sm font-medium text-gray-700 mb-2 block">
              Marital Status
            </Label>
            <Select defaultValue="married">
              <SelectTrigger id="marital-status" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Section 3: Emergency Contact */}
      <section className="border border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Emergency Contact</h2>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="emergency-contact-person" className="text-sm font-medium text-gray-700 mb-2 block">
                Contact Person
              </Label>
              <Input id="emergency-contact-person" defaultValue="Jane Smith" className="h-10" />
            </div>
            <div>
              <Label htmlFor="relationship" className="text-sm font-medium text-gray-700 mb-2 block">
                Relationship
              </Label>
              <Input id="relationship" defaultValue="Spouse" className="h-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="emergency-contact-number" className="text-sm font-medium text-gray-700 mb-2 block">
              Contact Number
            </Label>
            <Input id="emergency-contact-number" defaultValue="+1 (555) 987-6543" className="h-10" />
          </div>
        </div>
      </section>

      {/* Section 4: Banking Information */}
      <section className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Banking Information</h2>
          <Lock className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="bank-name" className="text-sm font-medium text-gray-700 mb-2 block">
                Bank Name
              </Label>
              <Input id="bank-name" defaultValue="Chase Bank" className="h-10" />
            </div>
            <div>
              <Label htmlFor="account-type" className="text-sm font-medium text-gray-700 mb-2 block">
                Account Type
              </Label>
              <Select defaultValue="checking">
                <SelectTrigger id="account-type" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="account-number" className="text-sm font-medium text-gray-700 mb-2 block">
                Account Number
              </Label>
              <div className="relative">
                <Input id="account-number" type="password" defaultValue="123456781234" className="h-10 pr-10" />
                <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" />
              </div>
            </div>
            <div>
              <Label htmlFor="routing-number" className="text-sm font-medium text-gray-700 mb-2 block">
                Routing Number
              </Label>
              <Input id="routing-number" defaultValue="021000021" className="h-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Notes */}
      <section className="border border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Notes</h2>
        <div>
          <Textarea
            placeholder="Add any additional notes about this employee..."
            className="min-h-[120px] resize-none"
            defaultValue="Employee prefers to work early morning shifts.&#10;Has requested accommodation for standing desk."
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">Character count: 127 / 5000</p>
            <p className="text-xs text-gray-400">Last updated by Sarah Johnson on Nov 20, 2024</p>
          </div>
        </div>
      </section>
    </div>
  )
}
