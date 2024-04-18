// Deque

type QueueTypes =
  | Uint8Array
  | Uint8ClampedArray
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array
  | BigUint64Array
  | BigInt64Array;

type TypedArray<T> = new (capacity: number) => T;

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
  public head: ListNode<T> | null = null;
  public tail: ListNode<T> | null = null;

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
      this.tail = tmp;
      this.size++;
    }
  }

  public removeHead() {
    const { head } = this;

    if (head == null || head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = head.next;
      this.head!.prev = null;
    }

    return head?.value;
  }

  public removeTail() {
    const { tail } = this;

    if (tail == null || tail === this.head) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = tail.prev;
      this.tail!.next = null;
    }

    return tail?.value;
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

class Dequeue<T extends QueueTypes> {
  length: number = 0;
  readonly capacity: number;
  readonly TypedArray: TypedArray<T>;

  list: LinkedList<T>;
  firstIndex: number | null = null;
  lastIndex: number | null = null;

  get first():
    | (T extends BigUint64Array | BigInt64Array ? bigint : number)
    | undefined {
    if (this.firstIndex == null) {
      return undefined;
    }

    // we address linked-list head.value
    // which is a TypedArray
    // so to get the value, we also specify an Index for TypedArray [this.firstIndex]

    return this.list.head!.value[this.firstIndex] as any;
  }

  get last():
    | (T extends BigUint64Array | BigInt64Array ? bigint : number)
    | undefined {
    if (this.lastIndex == null) {
      return undefined;
    }

    // we address linked-list tail.value
    // which is a TypedArray
    // so to get the value, we also specify an Index for TypedArray [this.lastIndex]

    return this.list.tail!.value[this.lastIndex] as any;
  }

  // in constructor we pass TypedArray type and its capacity
  // constructor creates Linked-List
  // and sets TypedArray as the Head of the Linked-List

  constructor(TypedArray: TypedArray<T>, capacity: number) {
    if (capacity <= 0 || capacity % 1 != 0) {
      throw new TypeError("The capacity can only be a positive integer");
    }

    this.capacity = capacity;
    this.TypedArray = TypedArray;

    this.list = new LinkedList<T>();
    this.list.addToHead(new TypedArray(capacity));
  }

  pushLeft(value: T extends BigUint64Array | BigInt64Array ? bigint : number) {
    this.length++;
    let { firstIndex } = this;

    // if first index does not exist,
    // that means we will initialise firstIndex as the middle of the initial array
    // firstIndex = Math.floor(this.capacity / 2);

    if (firstIndex == null) {
      firstIndex = Math.floor(this.capacity / 2);
    } else {
      // If the first index exists, decrement it.

      firstIndex--;

      // Then check if the decremented value is less than 0.
      // if firstIndex < 0 == true, it means the array has no free space from the Left
      // and we have to create a new array in nee Linked-List node, but in this case
      // firstIndex will be this.capacity - 1 and not Math.floor(this.capacity / 2)

      if (firstIndex < 0) {
        firstIndex = this.capacity - 1;
        this.list.addToHead(new this.TypedArray(this.capacity));
      }
    }

    // If firstIndex < 0 evaluates to false, it means the array has available space on the Left.
    // we set this.firstIndex = firstIndex;
    // address array in the head.value of the LinkedList, select element by the index [firstIndex]
    // and assign value to that

    this.firstIndex = firstIndex;
    this.list.head!.value[firstIndex] = value;

    if (this.lastIndex == null) {
      this.lastIndex = this.firstIndex;
    }

    return this.length;
  }

  popLeft():
    | (T extends BigUint64Array | BigInt64Array ? bigint : number)
    | undefined {
    let { firstIndex } = this;

    if (firstIndex == null) {
      return undefined;
    }

    this.length--;
    const value = this.list.head!.value[firstIndex];

    // null <- [_, _, _, _, _, _, _]

    if (firstIndex === this.lastIndex && this.list.head === this.list.tail) {
      this.firstIndex = null;
      this.lastIndex = null;
    } else {
      firstIndex++;

      if (firstIndex >= this.capacity) {
        firstIndex = 0;
        this.list.removeHead();
      }

      this.firstIndex = firstIndex;

      if (firstIndex > this.lastIndex! && this.list.head === this.list.tail) {
        // FIXME ставить в середину
        this.lastIndex = firstIndex;
      }
    }

    return value as any;
  }

  pushRight(value: T extends BigUint64Array | BigInt64Array ? bigint : number) {
    this.length++;
    let { lastIndex } = this;

    if (lastIndex == null) {
      lastIndex = Math.floor(this.capacity / 2);
    } else {
      lastIndex++;

      if (lastIndex >= this.capacity) {
        lastIndex = 0;
        this.list.addToTail(new this.TypedArray(this.capacity));
      }
    }

    this.lastIndex = lastIndex;
    this.list.tail!.value[lastIndex] = value;

    if (this.firstIndex == null) {
      this.firstIndex = this.lastIndex;
    }

    return this.length;
  }

  popRight():
    | (T extends BigUint64Array | BigInt64Array ? bigint : number)
    | undefined {
    let { lastIndex } = this;

    if (lastIndex == null) {
      return undefined;
    }

    this.length--;
    const value = this.list.tail!.value[lastIndex];

    if (lastIndex === this.firstIndex && this.list.head === this.list.tail) {
      this.firstIndex = null;
      this.lastIndex = null;
    } else {
      lastIndex--;

      if (lastIndex < 0) {
        lastIndex = this.capacity - 1;
        this.list.removeTail();
      }

      this.lastIndex = lastIndex;

      if (lastIndex < this.firstIndex! && this.list.head === this.list.tail) {
        this.firstIndex = lastIndex;
      }
    }

    return value as any;
  }
}

const dequeue = new Dequeue(Uint8Array, 8);

console.log(dequeue.capacity);
console.log(dequeue.TypedArray);
console.log(dequeue.list);

console.log(dequeue.pushLeft(1));
console.log(dequeue.pushLeft(3));
console.log(dequeue.pushLeft(2));

console.log(dequeue.list);
