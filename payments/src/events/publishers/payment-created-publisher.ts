import { PaymentCreatedEvent, Publisher, Subjects} from "@jjtickets2021/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
}