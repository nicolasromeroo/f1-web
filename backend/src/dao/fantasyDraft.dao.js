import FantasyDraft from "../models/fantasyDraft.model.js";

class FantasyDraftDAO {
    constructor() {
        this.FantasyDraft = FantasyDraft;
    }

    async createDraft(userId, raceId, mainDriverId, secondaryDriversIds) {
        try {
            const draft = await this.FantasyDraft.create({
                user: userId,
                race: raceId,
                mainDriver: mainDriverId,
                secondaryDrivers: secondaryDriversIds
            });
            return draft;
        } catch (error) {
            throw error;
        }
    }

    async updateDraftPoints(draftId, points, bonuses, penalties) {
        try {
            const draft = await this.FantasyDraft.findByIdAndUpdate(
                draftId,
                {
                    points,
                    bonuses,
                    penalties
                },
                { new: true }
            );
            return draft;
        } catch (error) {
            throw error;
        }
    }

    async getDraftByRound(round) {
        try {
            const parsedRound = parseInt(round);
            if (isNaN(parsedRound)) {
                return null;
            }
            const draft = await this.FantasyDraft.findOne({
                'race.round': parsedRound
            })
                .populate('race')
                .populate('mainDriver')
                .populate('secondaryDrivers')
                .populate('secondaryDrivers');
            return draft;
        } catch (error) {
            throw error;
        }
    }

    async getUserDrafts(userId) {
        try {
            const drafts = await this.FantasyDraft.find({ user: userId })
                .populate('race')
                .populate('mainDriver')
                .populate('secondaryDrivers');
            return drafts;
        } catch (error) {
            throw error;
        }
    }

    async getDraftByRace(userId, round) {
        try {
            const parsedRound = parseInt(round);
            if (isNaN(parsedRound)) return null;

            const drafts = await this.FantasyDraft.find({ user: userId })
                .populate('race')
                .populate('mainDriver')
                .populate('secondaryDrivers');

            const draft = drafts.find(d => d.race?.round === parsedRound);
            if (!draft || !draft.race) return null;
            return draft || null;
        } catch (error) {
            throw error;
        }
    }

    async populateDrivers(draft) {
        try {
            const populatedDraft = await this.FantasyDraft.findById(draft._id)
                .populate('mainDriver', 'name team points')
                .populate('secondaryDrivers', 'name team points');
            return populatedDraft;
        } catch (error) {
            throw error;
        }
    }
}

const fantasyDraftDao = new FantasyDraftDAO();

export default fantasyDraftDao;
