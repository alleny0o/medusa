import { FocusModal, Button, Heading, Prompt, toast } from "@medusajs/ui";
import { Media } from "../../types";
import { useState, useEffect } from "react";
import { Dropzone } from "./dropzone";
import { MediaItem } from "./media-item";

// dnd-kit imports
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { FileDTO } from "@medusajs/framework/types";

type EditModalProps = {
  variantId: string;
  medias: Media[];
  setMedias: (medias: Media[]) => void;
};

export const EditMediaModal = ({
  variantId,
  medias,
  setMedias,
}: EditModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedMedias, setEditedMedias] = useState<Media[]>([]);
  const [showConfirmPrompt, setShowConfirmPrompt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEditedMedias(medias);
    }
  }, [isOpen, medias]);

  /**
   * Compares two arrays of Media objects to determine if they are equal.
   * @param a First array of Media.
   * @param b Second array of Media.
   * @returns Boolean indicating whether the arrays are equal.
   */
  const areMediasEqual = (a: Media[], b: Media[]) => {
    if (a.length !== b.length) return false;
    return a.every(
      (media, index) =>
        media.file_id === b[index].file_id &&
        media.is_thumbnail === b[index].is_thumbnail
    );
  };

  /**
   * Handles the save action by updating the media list.
   * Performs deletion of removed medias and updates the server with the new list.
   */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (areMediasEqual(medias, editedMedias)) {
        setIsSaving(false);
        setIsOpen(false);
        toast.success("Media was successfully updated.");
        return;
      }

      // Step 1: Identify new files that need to be uploaded
      const newFiles = editedMedias.filter(
        (media: Media) => media.file instanceof File
      );
      let uploadedMedias: Media[] = [];

      // Step 2: Upload new files if any
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach((media: Media) => {
          formData.append("files", media.file!);
        });

        const uploadRes = await fetch(`/admin/variant-medias/upload`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload media files");

        const { files }: { files: FileDTO[] } = await uploadRes.json();

        if (files.length !== newFiles.length)
          throw new Error("Failed to upload all media files");

        uploadedMedias = files.map((file: FileDTO, index) => ({
          file_id: file.id,
          name: newFiles[index].name,
          size: newFiles[index].size,
          mime_type: newFiles[index].mime_type,
          is_thumbnail: false,
          url: file.url,
        }));
      }

      // Step 3: Reconstruct finalMedias preserving order
      const finalMedias: Media[] = [];
      let uploadIndex = 0;

      editedMedias.forEach((media: Media) => {
        if (media.file instanceof File) {
          finalMedias.push(uploadedMedias[uploadIndex]);
          uploadIndex++;
        } else {
          finalMedias.push(media);
        }
      });

      // Step 4: Determine which media files have been deleted by user
      const newFileIds = new Set(finalMedias.map((m) => m.file_id));
      const deletedMedias = medias.filter((m) => !newFileIds.has(m.file_id));

      // Step 5: Delete removed media files from server if any
      if (deletedMedias.length) {
        const deleteFilesRes = await fetch(`/admin/variant-medias/upload`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file_ids: deletedMedias.map((m) => m.file_id),
          }),
        });

        if (!deleteFilesRes.ok) throw new Error("Failed to delete medias");
      }

      // Step 6: Update the server with the new list of medias
      // First, remove all existing medias associated with the variant
      const deleteVariantMediasRes = await fetch(
        `/admin/variant-medias/variant/${variantId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!deleteVariantMediasRes.ok)
        throw new Error("Failed to delete medias");

      // Then, add the updated medias to the variant
      const createRes = await fetch("/admin/variant-medias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variant_id: variantId,
          medias: finalMedias,
        }),
      });

      if (!createRes.ok) throw new Error("Failed to save medias");

      // Step 7: Update the state with the new list of medias
      setMedias(finalMedias);
      setIsOpen(false);
      toast.success("Media was successfully updated.");
    } catch (error) {
      console.error("Error saving medias:", error);
      toast.error("Failed to save medias :(");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handles the cancel action by either closing the modal or showing a confirmation prompt
   * if there are unsaved changes.
   */
  const handleCancel = () => {
    if (areMediasEqual(medias, editedMedias)) {
      setIsOpen(false);
    } else {
      setShowConfirmPrompt(true);
    }
  };

  /**
   * Confirms the cancellation by deleting any unsaved medias and resetting the state.
   */
  const confirmCancel = async () => {
    try {
      const savedFileIds = new Set(medias.map((m) => m.file_id));
      const unsavedMedias = editedMedias.filter(
        (m) => !savedFileIds.has(m.file_id)
      );

      if (unsavedMedias.length > 0) {
        const deleteFilesRes = await fetch(`/admin/variant-medias/upload`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file_ids: unsavedMedias.map((m) => m.file_id),
          }),
        });
        if (!deleteFilesRes.ok) throw new Error("Failed to delete medias");
      }
    } catch (error) {
      console.error("Error deleting medias:", error);
    }
    setShowConfirmPrompt(false);
    setEditedMedias(medias);
    setIsOpen(false);
  };

  const closePrompt = () => setShowConfirmPrompt(false);

  /**
   * Removes a media item from the editedMedias list based on its file_id.
   * @param file_id The ID of the file to be deleted.
   */
  const handleDelete = (file_id: string) => {
    const updatedMedias = editedMedias.filter(
      (media) => media.file_id !== file_id
    );
    setEditedMedias(updatedMedias);
  };

  /**
   * Sets a specific media item as the thumbnail.
   * @param file_id The ID of the file to be set as thumbnail.
   */
  const handleThumbnail = (file_id: string) => {
    const updatedMedias = editedMedias.map((media) => ({
      ...media,
      is_thumbnail: media.file_id === file_id,
    }));
    setEditedMedias(updatedMedias);
  };

  // Handle drag and drop
  const getTaskPos = (id: string) => {
    return editedMedias.findIndex((m) => m.file_id === id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null); // Clear activeId if there's no target
      return;
    }

    if (active.id === over.id) {
      setActiveId(null); // Clear activeId if dropped on the same item
      return;
    }

    setEditedMedias((medias) => {
      const originalPos = getTaskPos(active.id as string);
      const newPos = getTaskPos(over.id as string);

      if (originalPos === -1 || newPos === -1) return medias;

      return arrayMove(medias, originalPos, newPos);
    });

    setActiveId(null); // Clear activeId after handling drag end
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <>
      <FocusModal
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            if (areMediasEqual(medias, editedMedias)) {
              setIsOpen(false);
            } else {
              setShowConfirmPrompt(true);
            }
          } else {
            setIsOpen(true);
          }
        }}
      >
        <FocusModal.Trigger asChild>
          <Button size="small" variant="secondary">
            Edit
          </Button>
        </FocusModal.Trigger>
        <FocusModal.Content>
          <FocusModal.Header>
            <Heading level="h2" id="dialog-title">
              Edit variant media
            </Heading>
          </FocusModal.Header>
          <FocusModal.Body
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <p id="dialog-description" className="sr-only">
              In this dialog, you can edit, rearrange, or delete media items. You
              can also upload new media.
            </p>
            <div className="flex size-full flex-col-reverse lg:grid lg:grid-cols-[1fr_560px]">
              <div className="bg-ui-bg-subtle size-full overflow-auto">
                <DndContext
                  sensors={sensors}
                  onDragEnd={handleDragEnd}
                  onDragStart={({ active }) => setActiveId(active.id as string)}
                  onDragCancel={() => setActiveId(null)}
                  collisionDetection={closestCorners}
                >
                  <div className="grid h-fit auto-rows-auto grid-cols-3 sm:grid-cols-4 gap-6 p-6">
                    <SortableContext
                      items={editedMedias.map((m: Media) => m.file_id!)}
                      strategy={rectSortingStrategy}
                    >
                      {editedMedias.map((media: Media) => (
                        <MediaItem
                          key={media.file_id}
                          id={media.file_id}
                          media={media}
                          onDelete={handleDelete}
                          onThumbnail={handleThumbnail}
                          isOverlay={false}
                          isActive={media.file_id === activeId} // Pass isActive prop
                        />
                      ))}
                    </SortableContext>
                  </div>
                  <DragOverlay>
                    {activeId ? (
                      <MediaItem
                        id={activeId}
                        media={
                          editedMedias.find((m) => m.file_id === activeId)!
                        }
                        onDelete={handleDelete}
                        onThumbnail={handleThumbnail}
                        isOverlay={true}
                        isActive={false}
                      />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </div>
              <div className="bg-ui-bg-base overflow-auto border-b px-6 py-4 lg:border-b-0 lg:border-l">
                <Dropzone
                  editedMedias={editedMedias}
                  setEditedMedias={setEditedMedias}
                />
              </div>
            </div>
          </FocusModal.Body>
          <FocusModal.Footer className="flex justify-end space-x-2">
            <Button size="small" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="small" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </FocusModal.Footer>
        </FocusModal.Content>
      </FocusModal>
  
      {/* Confirmation Prompt for Unsaved Changes */}
      <Prompt open={showConfirmPrompt} onOpenChange={setShowConfirmPrompt}>
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>Are you sure you want to leave this form?</Prompt.Title>
            <Prompt.Description>
              You have unsaved changes that will be lost if you exit this form.
            </Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Button size="small" variant="secondary" onClick={closePrompt}>
              Cancel
            </Button>
            <Button size="small" onClick={confirmCancel}>
              Continue
            </Button>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  );
  
};
