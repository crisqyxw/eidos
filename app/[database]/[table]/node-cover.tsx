import { useState } from "react"
import { ITreeNode } from "@/worker/meta_table/tree"

import { useNode } from "@/hooks/use-nodes"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { ImageSelector } from "./image-selector"

export const NodeCover = (props: { node: ITreeNode }) => {
  const { node } = props
  const [open, setOpen] = useState(false)

  const { updateIcon, updateCover } = useNode()
  const handleSelect = async (url: string) => {
    await updateCover(node?.id!, url)
  }
  const handleRemove = async () => {
    await updateCover(node?.id!, "")
  }

  return (
    <div className="group">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="fixed right-[24vw] opacity-0 group-hover:opacity-100">
            <Button>Change cover</Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <ImageSelector onSelected={handleSelect} onRemove={handleRemove} />
        </PopoverContent>
      </Popover>
      <img
        className="trigger"
        src={node.cover}
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          objectFit: "cover",
          height: "30vh",
          width: "100%",
        }}
      />
    </div>
  )
}
