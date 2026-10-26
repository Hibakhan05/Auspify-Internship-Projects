import StackChapter from "./chapters/StackChapter";
import LoopChapter from "./chapters/LoopChapter";
import RecordChapter from "./chapters/RecordChapter";

//  * Three scroll driven chapters. Each is a tall section holding a sticky
//  * viewport; the drawing is scrubbed across the section's whole height.

export default function Features() {
  return (
    <div id="features" className="scroll-mt-0">
      <StackChapter />
      <LoopChapter />
      <RecordChapter />
    </div>
  );
}
