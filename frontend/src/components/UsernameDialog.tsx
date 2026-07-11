import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsername } from "@/hooks/use-username";

export function UsernameDialog() {
  const { isDialogOpen, setUsername } = useUsername();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUsername(name);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] border-primary/20 bg-background/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-mono text-primary uppercase tracking-wider">Initialize Protocol</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your designation to begin typing. Leave blank to enter as Guest.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Input
              id="username"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-muted/50 border-primary/20 focus-visible:ring-primary text-lg"
              autoFocus
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest font-mono">
              Initialize
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
