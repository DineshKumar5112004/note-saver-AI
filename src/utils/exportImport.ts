import { Note } from '@/types/database';

// Export notes as JSON file
export const exportNotesAsJson = (notes: Note[]): void => {
  const dataStr = JSON.stringify(notes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `notesaver-pro-export-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Export single note as Markdown file
export const exportNoteAsMarkdown = (note: Note): void => {
  const markdownContent = `# ${note.title}

${note.content}

---
*Created: ${new Date(note.created_at).toLocaleDateString()}*
*Category: ${note.category || 'None'}*
*Tags: ${note.tags.join(', ') || 'None'}*
`;
  
  const dataBlob = new Blob([markdownContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
  link.click();
  URL.revokeObjectURL(url);
};

// Import notes from JSON file
export const importNotesFromJson = async (file: File): Promise<Note[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const notes = JSON.parse(content) as Note[];
        
        // Validate structure
        if (!Array.isArray(notes)) {
          reject(new Error('Invalid file format: expected an array of notes'));
          return;
        }
        
        const isValid = notes.every((note) => 
          note.title && note.content && note.user_id
        );
        
        if (!isValid) {
          reject(new Error('Invalid note structure in file'));
          return;
        }
        
        resolve(notes);
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Generate shareable link (note ID)
export const generateShareableLink = (noteId: string): string => {
  return `${window.location.origin}/note/${noteId}`;
};

// Copy note content to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
