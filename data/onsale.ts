import { NATIVE_MINT } from '@solana/spl-token'

// const mintsOnSale = []
const mintsOnSale = [
  {
    creator: "stacc",
    open: true,
    mint: '9g6RL4xmXygegijBmh5SMekvrRKdajDQxtGNoini64Z3',
    priceTags: [
      [
        {
          splToken: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
          bank: 'Gf3sbc5Jb62jH7WcTr3WSNGDQLk1w6wcKMZXKK1SC1E6',
          bankAta: '3a6vmVLpwXueJn68LWxtjbwhGaEWGJm4h34KgzXUmyyR',
          price: 50000,
          symbol: '$BONK'
        },
        {
          splToken: NATIVE_MINT.toBase58(),
          bank: 'Gf3sbc5Jb62jH7WcTr3WSNGDQLk1w6wcKMZXKK1SC1E6',
          bankAta: '',
          price: 0.69,
          symbol: 'SOL'
        }
    ],
      [
        {
          splToken: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
          bank: 'Gf3sbc5Jb62jH7WcTr3WSNGDQLk1w6wcKMZXKK1SC1E6',
          bankAta: '3a6vmVLpwXueJn68LWxtjbwhGaEWGJm4h34KgzXUmyyR',
          price: 150000,
          symbol: '$BONK'
        },
        {
          splToken: NATIVE_MINT.toBase58(),
          bank: 'Gf3sbc5Jb62jH7WcTr3WSNGDQLk1w6wcKMZXKK1SC1E6',
          bankAta: '',
          price: 0.33,
          symbol: 'SOL'
        }
    
      ],
      [
        
        {
          splToken: NATIVE_MINT.toBase58(),
          bank: 'Gf3sbc5Jb62jH7WcTr3WSNGDQLk1w6wcKMZXKK1SC1E6',
          bankAta: '',
          price: 1.69,
          symbol: 'SOL'
        },
      ]
    ]
  }
]

export default mintsOnSale
