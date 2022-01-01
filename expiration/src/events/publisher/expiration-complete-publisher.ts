import { ExpirationCompleteEvent, Publisher, Subjects } from "@jjtickets2021/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;  
}