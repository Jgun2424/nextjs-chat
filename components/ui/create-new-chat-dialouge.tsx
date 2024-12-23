'use client'

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/authContext"
import { useState } from "react"

export default function CreateNewChat({ user }: { user: any }) {
    const { createNewChat, searchForUser } = useAuth()
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [confirmDialog, setConfirmDialog] = useState(false)
    const [confirmUser, setConfirmUser] = useState<any>(null)

    // Search for users based on input
    const handleSearchUser = async (e: any) => {
        e.preventDefault()

        const searchInput = e.target.elements[0].value

        if (searchInput.trim() === '') {
            return
        }

        const results = await searchForUser(searchInput)
        setSearchResults(results)
    }

    // Open the dialog to confirm starting a new chat
    const handleCreateChat = (otherUser: any) => {
        if (user.uid === otherUser.uid) {
            return
        }
        setConfirmUser(otherUser)
        setConfirmDialog(true)
    }

    // Create a new chat using the createNewChat function from authContext
    const createChat = async () => {
        if (confirmUser) {
            try {
                // Use the createNewChat function from context to create the chat
                await createNewChat(user.uid, confirmUser.uid)

                // Close the dialog and clear results after chat creation
                setConfirmDialog(false)
                setSearchResults([]) // Clear search results after chat creation
            } catch (error) {
                console.error("Error creating chat: ", error)
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full" size="sm">
                    Start New Chat
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Start a new chat</DialogTitle>
                    <DialogDescription asChild>
                        <form className="flex flex-col gap-1" onSubmit={handleSearchUser}>
                            <span>Search for a user to start a new chat</span>
                            <Input placeholder="Search for a user" />

                            <div id="searchResults" className="mt-2 mb-2">
                                {searchResults.map((result) => (
                                    <div key={result.uid} onClick={() => handleCreateChat(result)}>
                                        <DialogClose className="flex items-center gap-2 hover:bg-secondary p-2 rounded-md cursor-pointer w-full">
                                            <Avatar>
                                                <AvatarImage src={result.photoURL} />
                                                <AvatarFallback>{result.displayName[0]}</AvatarFallback>
                                            </Avatar>
                                            <span>@{result.displayName}</span>
                                        </DialogClose>
                                    </div>
                                ))}
                            </div>

                            <Button variant="outline" className="w-full">
                                Search
                            </Button>
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>

            <Dialog open={confirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create new chat</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to start a new chat with {confirmUser?.displayName}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={createChat}>Create Chat</Button>
                        <Button variant="outline" onClick={() => setConfirmDialog(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Dialog>
    )
}
