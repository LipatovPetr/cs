//  Doubly Linked List  (DLL)

class ListNode<T> {
  public value: T;
  public next: ListNode<T> | null = null;
  public prev: ListNode<T> | null = null;

  constructor(
    value: T,
    {
      next = null,
      prev = null,
    }: { prev?: ListNode<T> | null; next?: ListNode<T> | null }
  ) {
    this.value = value;

    // if prev is passed then
    // it is set as this.prev
    // but also prev.next is set to THIS node

    if (prev !== null) {
      this.prev = prev;
      prev.next = this;
    }

    // if next is passed then
    // it is set as this.next
    // but also next.prev is set to THIS node

    if (next !== null) {
      this.next = next;
      next.prev = this;
    }
  }
}

class LinkedList<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;

  private size: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  public length(): number {
    return this.size;
  }

  public isEmpty(): boolean {
    return this.size <= 0;
  }

  public getHead(): T {
    if (this.head) {
      return this.head.value;
    } else {
      throw new RangeError("Nothing to display, current List is empty");
    }
  }

  public getTail(): T {
    if (this.tail) {
      return this.tail.value;
    } else {
      throw new RangeError("Nothing to display, current List is empty");
    }
  }

  public addToHead(value: any) {
    if (this.isEmpty()) {
      // if list is empty:
      // create a node,
      // and set it as a head and a tail of the Linked List,
      // increase list size by 1
      let tmp = new ListNode<T>(value, {});
      this.head = tmp;
      this.tail = tmp;
      this.size++;
    } else {
      // if list is not empty: create a node,
      // pass it { next: this.head }
      // set it as this.head
      let tmp = new ListNode<T>(value, { next: this.head });
      this.head = tmp;
      this.size++;
    }
  }

  public addToTail(value: T) {
    if (this.isEmpty()) {
      this.addToHead(value);
    } else {
      let tmp = new ListNode<T>(value, { prev: this.tail });

      this.tail!.next = tmp;
      this.tail = tmp;
      this.size++;
    }
  }

  display(): void {
    if (this.isEmpty()) {
      throw new RangeError("Nothing to display, current List is empty");
    }

    let current = this.head;

    while (current) {
      console.log(current);
      current = current.next;
    }
  }

  [Symbol.iterator]() {
    let currentNode = this.head;

    return {
      next() {
        if (!currentNode) return { value: undefined, done: true };
        const returnValue = {
          value: currentNode.value,
          done: false,
        };
        currentNode = currentNode.next;
        return returnValue;
      },
    };
  }
}

const DLL = new LinkedList<number>();

DLL.addToTail(1);
DLL.addToTail(2);
DLL.addToTail(3);
DLL.addToTail(4);

for (const value of DLL) {
  console.log("value:", value);
}
