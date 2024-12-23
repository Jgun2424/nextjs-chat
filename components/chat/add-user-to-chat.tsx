'use client'

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/authContext"
import { useState } from "react"
import { UserPlusIcon } from "lucide-react"

export default function AddUserToChat({ chatId }: { chatId: string }) {
    const { searchForUser, addUserToChat } = useAuth()
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

    // Open the dialog to confirm adding the user to the chat
    const handleAddUser = (otherUser: any) => {
        setConfirmUser(otherUser)
        setConfirmDialog(true)
    }

    // Add the user to the chat
    const addUser = async () => {
        if (confirmUser) {
            try {
                await addUserToChat(chatId, confirmUser.uid)

                // Close the dialog and clear results after adding user
                setConfirmDialog(false)
                setSearchResults([]) // Clear search results after adding user
            } catch (error) {
                console.error("Error adding user to chat: ", error)
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full h-full" size="default">
                    <UserPlusIcon size={24} />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add User to Chat</DialogTitle>
                    <DialogDescription asChild>
                        <form className="flex flex-col gap-1" onSubmit={handleSearchUser}>
                            <span>Search for a user to add to this chat</span>
                            <Input placeholder="Search for a user" />

                            <div id="searchResults" className="mt-2 mb-2">
                                {searchResults.map((result) => (
                                    <div key={result.uid} onClick={() => handleAddUser(result)}>
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
                        <DialogTitle>Add User to Chat</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to add {confirmUser?.displayName} to this chat?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={addUser}>Add User</Button>
                        <Button variant="outline" onClick={() => setConfirmDialog(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Dialog>
    )
}
