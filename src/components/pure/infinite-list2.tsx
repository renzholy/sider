import { useRef, ComponentType } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

export default function InfiniteList2<T>(props: {
  items?: { next: string; keys: T[] }[]
  hasNextPage: boolean
  children: ComponentType<{ value: T }>
}) {
  const parentRef = useRef(null)
  const rowVirtual = useVirtualizer({
    count:
      props.items && props.hasNextPage
        ? props.items.length + 1
        : props.items?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => 36 * (props.items?.[index]?.keys.length || 0),
    overscan: 5,
  })

  return (
    <div
      ref={parentRef}
      style={{ width: '100%', height: '100%', overflowY: 'auto' }}
    >
      <div
        style={{
          height: `${rowVirtual.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtual.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {props.items?.[virtualRow.index]?.keys?.map((item, index) => (
              <props.children key={index} value={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
