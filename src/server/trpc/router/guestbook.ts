import {z} from 'zod'
import {protectedProcedure, publicProcedure, router} from '../trpc'

export const guestRouter = router({
	postMessage: protectedProcedure
		.input(z.object({message1: z.string(), name1: z.string()}))
		.mutation((req) => {
			return req.ctx.prisma.guestbook.create({
				data: {
					message: req.input.message1,
					name: req.input.name1,
				},
			})
		}),
		getAll: publicProcedure.query(({ctx}) => {
			return ctx.prisma.guestbook.findMany()
		}),
})