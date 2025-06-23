"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Mail, Clock, User, MessageSquare, Archive, Reply } from "lucide-react"

export default function ContactMessages() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyText, setReplyText] = useState("")
  const { toast } = useToast()

  const statusOptions = [
    { value: "unread", label: "Unread", color: "bg-red-500/20 text-red-400" },
    { value: "read", label: "Read", color: "bg-blue-500/20 text-blue-400" },
    { value: "replied", label: "Replied", color: "bg-green-500/20 text-green-400" },
    { value: "archived", label: "Archived", color: "bg-gray-500/20 text-gray-400" },
  ]

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      setIsLoading(true)
      // This would connect to your contact messages API
      // For now, showing sample data
      const sampleMessages = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          subject: "Project Inquiry",
          message: "Hi, I'm interested in discussing a potential project collaboration...",
          status: "unread",
          created_at: new Date().toISOString(),
        },
      ]
      setMessages(sampleMessages)
    } catch (error) {
      console.error("Error loading messages:", error)
      toast({
        title: "Error",
        description: "Failed to load contact messages",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      // This would update the message status in your database
      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status: newStatus } : msg)))
      toast({
        title: "Success",
        description: "Message status updated",
      })
    } catch (error) {
      console.error("Error updating message:", error)
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find((opt) => opt.value === status)
    return statusOption || statusOptions[0]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Contact Messages</h2>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-red-500/20 text-red-400">
            {messages.filter((m) => m.status === "unread").length} Unread
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            {messages.length} Total
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="w-12 h-12 text-gray-500 mb-4" />
              <p className="text-gray-400 text-center">
                No contact messages yet. Messages from your portfolio contact form will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => {
            const statusBadge = getStatusBadge(message.status)
            return (
              <Card key={message.id} className="bg-[#2A2A2A] border-[#3A3A3A]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <User className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{message.name}</h3>
                        <p className="text-blue-400 text-sm">{message.email}</p>
                        <p className="text-gray-300 font-medium mt-1">{message.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusBadge.color}>{statusBadge.label}</Badge>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Clock className="w-3 h-3" />
                        {formatDate(message.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A] rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">Message:</span>
                    </div>
                    <p className="text-gray-300">{message.message}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Select value={message.status} onValueChange={(value) => updateMessageStatus(message.id, value)}>
                        <SelectTrigger className="w-32 bg-[#1A1A1A] border-[#3A3A3A] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-[#3A3A3A]">
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-white">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                        onClick={() => setSelectedMessage(message)}
                      >
                        <Reply className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
                        onClick={() => updateMessageStatus(message.id, "archived")}
                      >
                        <Archive className="w-4 h-4 mr-1" />
                        Archive
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {selectedMessage && (
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle className="text-white">Reply to {selectedMessage.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-[#1A1A1A] rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Original message:</p>
                <p className="text-gray-300">{selectedMessage.message}</p>
              </div>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="bg-[#1A1A1A] border-[#3A3A3A] text-white min-h-[120px]"
                placeholder="Type your reply..."
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    // This would send the reply email
                    toast({
                      title: "Success",
                      description: "Reply sent successfully",
                    })
                    setSelectedMessage(null)
                    setReplyText("")
                    updateMessageStatus(selectedMessage.id, "replied")
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Send Reply
                </Button>
                <Button
                  onClick={() => {
                    setSelectedMessage(null)
                    setReplyText("")
                  }}
                  variant="outline"
                  className="border-gray-500 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
