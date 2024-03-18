import {
    Bot,
    Cable,
    PinIcon,
    PinOffIcon,
    SparklesIcon,
    Unplug,
} from "lucide-react"

import { AvatarList } from "@/components/avatar-list"
import { ShareDialog } from "@/components/share-dialog"
import { Button } from "@/components/ui/button"
import { useAPIAgent } from "@/hooks/use-api-agent"
import { useCurrentNode } from "@/hooks/use-current-node"
import { useNodeTree } from "@/hooks/use-node-tree"
import { usePeer } from "@/hooks/use-peer"
import { useAppRuntimeStore } from "@/lib/store/runtime-store"
import { cn } from "@/lib/utils"

import { useSpaceAppStore } from "../../app/[database]/store"
import { useConfigStore } from "../../app/settings/store"

export const NavStatus = () => {
  const { isAiOpen, setIsAiOpen } = useSpaceAppStore()
  const { connected } = useAPIAgent()

  const {
    disableDocAIComplete,
    setDisableDocAIComplete,
    isCompleteLoading,
    isShareMode,
  } = useAppRuntimeStore()
  const { currentCollaborators } = usePeer()
  const nameList = currentCollaborators.map((c) => c.name)
  const currentNode = useCurrentNode()
  const { pin, unpin } = useNodeTree()

  const {
    experiment: { enableAICompletionInDoc },
  } = useConfigStore()
  const toggleDocAIComplete = () => {
    setDisableDocAIComplete(!disableDocAIComplete)
  }
  const toggleAi = () => {
    setIsAiOpen(!isAiOpen)
  }

  return (
    <>
      <AvatarList nameList={nameList} />
      {enableAICompletionInDoc && (
        <div
          className="cursor-pointer p-2"
          title={
            isCompleteLoading
              ? "AI is working hard, please wait a moment"
              : disableDocAIComplete
              ? "Enable AI Complete"
              : "Disable AI Complete"
          }
          onClick={toggleDocAIComplete}
        >
          <SparklesIcon
            className={cn(
              "h-5 w-5",
              disableDocAIComplete ? "text-gray-400" : "text-green-500",
              // when loading, blink the icon with purple color
              isCompleteLoading && "animate-pulse text-purple-500"
            )}
          />
        </div>
      )}

      <div
        className="p-2"
        title={connected ? "API Agent Connected" : "No API Agent Connected"}
      >
        {connected ? (
          <Cable className="h-5 w-5 text-green-500" />
        ) : (
          <Unplug className="h-5 w-5 text-red-500" />
        )}
      </div>
      {currentNode && (
        <div
          title={
            currentNode?.is_pinned
              ? "this node is pinned, click to unpin"
              : "click to pin this node"
          }
        >
          {currentNode?.is_pinned ? (
            <Button variant="ghost" onClick={() => unpin(currentNode.id)}>
              <PinOffIcon className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => pin(currentNode.id)}>
              <PinIcon className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}
      {!isShareMode && <ShareDialog />}
      <Button variant="ghost" onClick={toggleAi}>
        <Bot className="h-5 w-5" />
      </Button>
    </>
  )
}