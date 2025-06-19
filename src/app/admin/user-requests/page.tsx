"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MoreHorizontal, Search, Download, RefreshCw, Loader2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BaseUrl } from "@/lib/utils"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

const API_URL = BaseUrl;

interface UserRequest {
  id: string;
  userId: string;
  username: string;
  requestType: string;
  title: string;
  description: string;
  status: string; 
  createdAt: string;
  characterId?: string;
}
interface RawUserRequest {
    id: string;
    userId: string;
    user: {
        username: string;
    };
    character?: {
        name?: string;
        description?: string;
    };
    status: string;
    createdAt: string;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

export default function UserRequestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(null)
  const [userRequests, setUserRequests] = useState<UserRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  useEffect(() => {
    fetchUserRequests()
  }, [])
  
  const fetchUserRequests = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_URL}/admin/user-requests`, {
        withCredentials: true
      })
      
      if (response.data.success) {
        

        const formattedData: UserRequest[] = (response.data.data as RawUserRequest[]).map((request: RawUserRequest): UserRequest => ({
            id: request.id,
            userId: request.userId,
            username: request.user.username,
            requestType: "character", // Assuming all requests are character requests
            title: request.character?.name || "Character Request",
            description: request.character?.description || "No description provided",
            status: request.status.toLowerCase(),
            createdAt: request.createdAt
        }))
        setUserRequests(formattedData)
      } else {
        toast.error("Failed to fetch user requests")
      }
    } catch (error) {
      console.error("Error fetching user requests:", error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch user requests")
      } else {
        toast.error("Failed to fetch user requests")
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      setIsSubmitting(true)
      const response = await axios.put(`${API_URL}/admin/user-requests/${requestId}`, {
        status: status.toUpperCase(), 
        adminNote: adminNotes.trim() // Send admin notes if any
      }, {
        withCredentials: true
      })
      
      if (response.data.success) {
        toast.success(`Request status updated to ${status}`)
        
        setUserRequests(prev => 
          prev.map(req => 
            req.id === requestId ? { ...req, status } : req
          )
        )
        setIsDialogOpen(false)
      } else {
        toast.error("Failed to update request status")
      }
    } catch (error) {
      console.error("Error updating request status:", error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update request status")
      } else {
        toast.error("Failed to update request status")
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending": return "outline"
      case "approved": return "secondary"
      case "in-progress": return "default"
      case "resolved": return "default" 
      case "rejected": return "destructive"
      default: return "outline"
    }
  }
  
  const handleRefresh = () => {
    fetchUserRequests()
  }
  
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
  }
  
  const handleUpdateRequest = () => {
    if (selectedRequest && selectedStatus) {
      updateRequestStatus(selectedRequest.id, selectedStatus)
    }
  }
  
  const filteredRequests = userRequests.filter(request => {
    const matchesSearch = 
      request.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      request.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.username?.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "pending") return matchesSearch && request.status === "pending"
    if (activeTab === "approved") return matchesSearch && request.status === "approved"
    if (activeTab === "rejected") return matchesSearch && request.status === "rejected"
    
    return matchesSearch
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Requests</h1>
          <p className="text-muted-foreground">Manage feature requests, character suggestions, and bug reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mb-6">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[300px]"
        />
      </div>
      
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>User Requests</CardTitle>
          <CardDescription>
            Total: {filteredRequests.length} requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading requests...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">#{request.id.substring(0, 8)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.requestType}</Badge>
                    </TableCell>
                    <TableCell>{request.title}</TableCell>
                    <TableCell>{request.username}</TableCell>
                    <TableCell>{formatDate(request.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setSelectedRequest(request)
                              setSelectedStatus(request.status)
                              setAdminNotes("")
                              setIsDialogOpen(true)
                            }}
                          >
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                          <DialogHeader>
                            <DialogTitle>Request #{request.id.substring(0, 8)}: {request.title}</DialogTitle>
                            <DialogDescription>
                              Submitted by {request.username} on {formatDate(request.createdAt)}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="text-right font-medium">Request Type:</span>
                              <Badge variant="outline" className="col-span-3">
                                {request.requestType}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="text-right font-medium">Status:</span>
                              <Select 
                                defaultValue={request.status} 
                                onValueChange={handleStatusChange}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                              <span className="text-right font-medium">Description:</span>
                              <div className="col-span-3 bg-muted p-3 rounded-md">
                                {request.description}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                              <span className="text-right font-medium">Admin Notes:</span>
                              <Textarea 
                                className="col-span-3" 
                                placeholder="Add internal notes here..." 
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter className="flex justify-between">
                            <Button variant="outline">Contact User</Button>
                            <Button 
                              onClick={handleUpdateRequest}
                              disabled={isSubmitting}
                            >
                              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Update Request
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setSelectedRequest(request)
                            setSelectedStatus("approved")
                            updateRequestStatus(request.id, "approved")
                          }}>
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedRequest(request)
                            setSelectedStatus("rejected")
                            updateRequestStatus(request.id, "rejected")
                          }}>
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredRequests.length} of {userRequests.length} requests
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
