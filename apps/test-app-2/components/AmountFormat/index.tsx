import { formatAmount } from "@/lib/format"

export const AmountFormat = ({amount}: {amount?: string | number}) => {
    const {
        start,
        zeroCount,
        end
      } = formatAmount(amount) 

  return( amount || amount === 0) ? (  
    
    <span>
      {start}
      {zeroCount ? <span style={{zoom: 0.8}} className=" relative top-[3px] px-[0.2em]">{zeroCount}</span> : null}
      {end}
    </span>
  ) : '-'
}
