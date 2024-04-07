//  Doubly Linked List  (DLL)

class DoublyLinkedListNode {
  public value: any;
  public next: null | DoublyLinkedListNode;
  public prev: null | DoublyLinkedListNode;
}

class DoublyLinkedList {
  private head: null | DoublyLinkedListNode;
  private tail: null | DoublyLinkedListNode;

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

  public getHead(): number {
    if (this.head) {
      return this.head.value;
    } else {
      throw new RangeError("Nothing to display, current List is empty");
    }
  }

  public getTail(): number {
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
      // and set it as a head and a tail,
      // increase list size by 1
      let tmp = new DoublyLinkedListNode();
      tmp.value = value;
      this.head = tmp;
      this.tail = tmp;
      this.size++;
    } else {
      // if list is not empty: create a node,
      // set current head node as its 'next' node,
      // set prev as null, bc we are adding to the head
      let tmp = new DoublyLinkedListNode();
      tmp.next = this.head;
      tmp.prev = null;
      tmp.value = value;

      // also we have to update node that used to be the head,
      // and current link head variable as well:
      // set current head prev as new temp node,
      // set this.head as new node

      this.head!.prev = tmp;
      this.head = tmp;
      this.size++;
    }
  }

  public addToTail(value: any) {
    if (this.isEmpty()) {
      this.addToHead(value);
    } else {
      let tmp = new DoublyLinkedListNode();
      tmp.value = value;
      tmp.prev = this.tail;

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

const DLL = new DoublyLinkedList();

DLL.addToTail(1);
DLL.addToTail(2);
DLL.addToTail(3);
DLL.addToTail(4);

for (const value of DLL) {
  console.log("value:", value);
}
