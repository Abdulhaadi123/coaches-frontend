"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface AddNewRepModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (repData: { name: string; email: string; phone: string }) => void
}

export default function AddNewRepModal({ isOpen, onClose, onSave }: AddNewRepModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  if (!isOpen) return null

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      return
    }
    onSave(formData)
    setFormData({ name: "", email: "", phone: "" })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in-50 duration-300 p-4">
      <Card className="w-full max-w-md max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900">Add New Sales Rep</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto flex-1">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>



          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              style={{ borderColor: "#6b7280", color: "#6b7280" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={!formData.name || !formData.email}
              style={{ backgroundColor: "#284EA7", color: "white" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1e3a8a"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#284EA7"
              }}
            >
              Add Rep
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
