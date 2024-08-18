import { Model } from "@nozbe/watermelondb";
import { date, readonly, field, text } from "@nozbe/watermelondb/decorators";
export default class Cards extends Model {
  static table: string = "cards";
  // @ts-ignore
  @readonly @text("question") question: string;
  // @ts-ignore
  @readonly @text("answer") answer: string;
  // @ts-ignore
  @readonly @field("is_done") is_done;
  // @ts-ignore
  @readonly @field("is_pinned") is_pinned;
}
