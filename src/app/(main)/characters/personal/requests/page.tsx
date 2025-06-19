"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, TableIcon, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import api from "@/lib/axiosInstance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import BackgroundDesign from "@/components/background-design";

type CharacterRequest = {
  id: string;
  userId: string;
  characterId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
  character: {
    id: string;
    name: string;
    personality: string;
    avatar?: string;
  };
};

export default function CharacterRequestsPage() {
  const [requests, setRequests] = useState<CharacterRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"cards" | "table">("cards");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get("/character/public-requests", {
        withCredentials: true,
      });

      if (!response.status || response.status !== 200) {
        console.error("Failed to fetch requests:", response.statusText);
        throw new Error("Failed to fetch requests");
      }

      const data = await response.data;
      setRequests(data.requests || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load your character requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500";
      case "REJECTED":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const refreshRequests = () => {
    toast.promise(
      fetchRequests(),
      {
        loading: 'Refreshing requests...',
        success: 'Requests refreshed successfully',
        error: 'Failed to refresh requests',
      }
    );
  };

  const filteredRequests = requests.filter(request => 
    statusFilter === "ALL" ? true : request.status === statusFilter
  );

  return (
    <>
    <BackgroundDesign />
      <div className="h-full w-full flex justify-center py-10 overflow-y-auto px-2 md:px-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-thumb-gray-800">
        <div className="w-full max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">My Character Public Requests</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Track the status of your requests to make characters public
              </p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <ToggleGroup type="single" value={viewType} onValueChange={(value) => value && setViewType(value as "cards" | "table")}>
                <ToggleGroupItem value="cards" aria-label="Card View">
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label="Table View">
                  <TableIcon className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
              <Button variant="outline" onClick={refreshRequests} className="ml-2">
                <RefreshCw className="mr-2 h-4 w-4" />
                <span className="inline">Refresh</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 mb-6 overflow-x-auto pb-2">
            <Button 
              variant={statusFilter === "ALL" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("ALL")}
              className="rounded-full text-xs sm:text-sm w-full sm:w-auto justify-center"
            >
              All Requests
            </Button>
            <Button 
              variant={statusFilter === "PENDING" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("PENDING")}
              className="rounded-full text-xs sm:text-sm w-full sm:w-auto justify-center"
            >
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
              Pending
            </Button>
            <Button 
              variant={statusFilter === "APPROVED" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("APPROVED")}
              className="rounded-full text-xs sm:text-sm w-full sm:w-auto justify-center"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
              Approved
            </Button>
            <Button 
              variant={statusFilter === "REJECTED" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("REJECTED")}
              className="rounded-full text-xs sm:text-sm w-full sm:w-auto justify-center"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
              Rejected
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No Requests Found</h2>
              <p className="text-muted-foreground mb-6">
                You haven&apos;t made any requests to make your characters public yet.
              </p>
              <Link href="/characters/personal">
                <Button>Go to My Characters</Button>
              </Link>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12 bg-card border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">No {statusFilter !== "ALL" ? statusFilter.toLowerCase() : ""} requests found</h2>
              <p className="text-muted-foreground mb-6">
                Try changing your filter to see other requests
              </p>
              <Button variant="outline" onClick={() => setStatusFilter("ALL")}>
                Show All Requests
              </Button>
            </div>
          ) : viewType === "cards" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 pb-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{request.character.name}</CardTitle>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Requested {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-12 w-12 relative">
                        <AvatarImage src={request.character.avatar || ""} alt={request.character.name} />
                        <AvatarFallback>
                          {request.character.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.character.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {request.character.personality}
                        </p>
                      </div>
                    </div>
                    {request.adminNote && (
                      <div className="bg-muted p-3 rounded-md text-sm mt-2">
                        <p className="font-medium mb-1">Admin Note:</p>
                        <p>{request.adminNote}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link href={`/characters/${request.characterId}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        View Character
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Character</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Requested</TableHead>
                    <TableHead className="hidden lg:table-cell">Admin Note</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <Avatar className="h-8 w-8 md:h-10 md:w-10">
                          <AvatarImage src={request.character.avatar || ""} alt={request.character.name} />
                          <AvatarFallback>
                            {request.character.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm md:text-base">{request.character.name}</div>
                        <div className="md:hidden">
                          <Badge className={`${getStatusColor(request.status)} text-xs`}>
                            {request.status}
                          </Badge>
                        </div>
                        <div className="text-xs md:text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-[200px]">
                          {request.character.personality}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs md:text-sm whitespace-nowrap">
                        {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell max-w-[200px]">
                        {request.adminNote ? (
                          <div className="text-xs md:text-sm truncate">{request.adminNote}</div>
                        ) : (
                          <span className="text-muted-foreground text-xs md:text-sm">No notes</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/characters/${request.characterId}`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs md:text-sm px-2 md:px-4">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
